---
layout: post
title:  "How to Properly Upsample Rare Events For Regression"
subtitle: "It turns out IPW and Weighted Least Squares are useful for something after all"
date:   2026-09-28 00:00:00 -0500
categories: jekyll update
---

**Table of contents:**
[Sampling and IPW](#sampling-and-ipw) | [IPW with Weighted Least Squares](#ipw-with-weighted-least-squares) | [A Quick Simulation](#a-quick-simulation) | [Closing](#closing)

## Sampling and IPW

I love sampling, and you should, too!

It seems counterintuitive that even very small samples can yield reliable estimates for certain population quantities. David Sacks and Elon Musk famously ripped Twitter's bot detection sampling strategy when Musk was thinking about acquiring the company four years ago[^1]:

<img src="/assets/article_images/2026-09-28-images/david_sacks_tweet.png" alt="David Sacks makes a dumb tweet on Twitter's bot sampling strategy" width="600">

But this is a common misunderstanding of what "good" sampling is; obviously, larger samples provide less noisy estimates, but part of the reason we sample is because of some constraints that prevent us from pulling in large swaths of data to begin with. What matters most is *the procedure* by which we sample data, which helps our sample estimates target population quantities in expectation. Sampling (and re-sampling) at random is usually a safe bet, even with relatively small sample sizes. Data scientist and Facebook whistleblower <a href="https://en.wikipedia.org/wiki/Sophie_Zhang_(whistleblower)">Sophie Zhang</a> had a very good analogy about sampling that resonates with me to this day:

<img src="/assets/article_images/2026-09-28-images/sophie_zhang_tweet.png" alt="Sophie Zhang analogizes sampling to spoons of soup." width="600">

(Also wanted to plug some very good required reading from Xiao-Li Meng's <a href="https://statistics.fas.harvard.edu/sites/g/files/omnuum10116/files/statistics-2/files/statistical_paradises_and_paradoxes.pdf">*Big Data Paradox*</a> paper; tl;dr, large, selected samples amplify underlying bias and have statistical value that isn't much better than a smaller, random sample.)

Among the constraints that necessitate sampling are computational constraints; when you're dealing with hundreds of millions of rows of *monthly* data at, oh, I don't know, a Very Big Tech Company™️, it's just not practical to query every single row of data when a smaller random sample gets you fairly precise estimates of the overall population picture; in these settings, even a 1% sample can yield millions of rows, providing ample statistical power for inferential tasks.

There is one <a href="https://www.youtube.com/shorts/7QyOvqmw3Is">Kiriakou-esque half-exception</a> to naively sampling for every task, however: rare-event modeling.

Let's say that among those hundreds of millions of rows of experimental data, we have a couple thousand examples of some incident; we might be interested in knowing whether assignment to the treatment group reduced the prevalence of this incident in an experimental context, or we might be interested in knowing whether base rates among different customer segments differ for this incident. But by taking a 1% sample, we may end up with very few examples of this incident in our sampled dataset; in fact, in this setup, the number of incidents sampled approximately follows $$X \sim \text{HyperGeometric}(N = 100M, K = 2000, n = 1M)$$, so we would only expect $$\mathbb{E}[X] = 1M \frac{2000}{100M} = 20$$ of these incidents to show up in our sample with a standard deviation of around $$4.5$$. If we're doing a treatment vs. holdout comparison where holdout is 1/4th the size of treatment, or comparing incident rates by customer segment in the experiment, we might quickly run into single-digit subgroup counts, and possibly even 0 for smaller subgroups.

So what should we do? One idea is of course to just take a bigger sample, say 10%, but even that only gets you an expected 200 incident counts which might still be too sparse for well-powered subgroup inference. Additionally, the reason we're taking samples in the first place is due to the presence of some constraints where taking larger and larger samples is costly or infeasible, so simply scaling up the sampling probability is not an adequate solution.

Another idea is just to retain all 2,000 incidents,[^2] and then take a 1% downsample of the rest of the data. This gets you enough statistical power, but the new problem we've created is that this sampled data artificially inflates the prevalence of the event, so naive sample base rate estimates no longer target their population counterparts. Imagine we had 1 incident in $$N = 101$$ data points, kept the 1 incident, then did a 1% downsample of the remaining 100 data points and happened to draw 1; suddenly, this incident has gone from <1% prevalence to 50% prevalence in our downsampled data[^3]. To echo Sophie Zhang, our soup is not evenly mixed.

But not all hope is lost. If our downsampling procedure gives each data point a known probability of inclusion, we can assign *sampling weights* to restore the original baseline distribution of incidents:non-incidents.

This raises the question of what makes a given choice of sampling weights "good." A very obvious choice is to just assign a sampling weight equal to the inverse of the downsampling percentage; if we take a 1% downsample, we can simply assign those downsampled data points a weight of 100, so each sampled data point "represents" 100 population data points and restores distributional balance in our data. This is known as inverse probability weighting (IPW), and a common choice for an IPW estimator is the Horvitz-Thompson (HT) estimator, which follows the setup I described: each unit $$i$$ gets a weight $$\frac{1}{\pi_i}$$, where $$\pi_i$$ is its known probability of inclusion in the sample $$S$$ (e.g., 0.01), and the estimator is $$\hat\tau_{HT} = \frac{1}{N}\sum_{i \in S} \frac{y_i}{\pi_i}$$, which is unbiased for the population mean $$\frac{1}{N} \sum_{i=1}^N y_i$$.

One unfortunately undesirable property of the HT estimator is that it is not invariant to location transformations in the outcome. If we shift all our outcomes $$y_i$$ by $$c$$ units, then the population mean should also shift by $$c$$ units; however, the HT estimate of the shifted outcome is

$$\frac{1}{N} \sum_{i \in S} \frac{y_i + c}{\pi_i} = \hat{\tau}_{HT}(y) + c \cdot \frac{1}{N} \sum_{i \in S} \frac{1}{\pi_i}$$

The factor multiplying $$c$$ has expectation $$1$$, but in any realized sample it is generically not exactly $$1$$, so the estimate doesn't shift by exactly $$c$$ (see chapter 11 of <a href="https://arxiv.org/pdf/2305.18793">Ding's causal inference textbook</a>). This is problematic in settings where, say, we're working with outcomes with arbitrary baselines that have constant offsets in their units, like temperature (Kelvin is just Celsius but shifted 273.15 units up).

As an aside, I made this meme three years ago to express my distaste for the HT estimator:

<img src="/assets/article_images/2026-09-28-images/ht_estimator_meme.jpg" alt="HT Estimator Meme: Oh hell nah!! Not my son!!" width="400">

Luckily, there actually is a very simple alternative estimator that has lower variance for lots of estimation tasks and is also invariant to location shifts: if you normalize the HT estimator by the estimated population size, $$\sum_{i \in S} \frac{1}{\pi_i}$$, instead of the known $$N$$, you get *Hájek's estimator*, given by

$$\hat\tau_{Hajek} = \frac{\sum_{i \in S} \frac{y_i}{\pi_i}}{\sum_{i \in S} \frac{1}{\pi_i}}$$

So in my incidents example, we would construct weights $$w_i = \frac{1}{\pi_i}$$ exactly as before, but instead of computing $$\frac{1}{N}\sum_{i \in S} w_i y_i$$, we'd compute the *ratio* $$\frac{\sum_{i \in S} w_i y_i}{\sum_{i \in S} w_i}$$, so the weights are normalized by the total weight actually present in the sample, rather than by a fixed $$N$$ that the realized sample may not add up to. (Of course, under fixed-size simple random sampling, where all units have the same inclusion probability, $$\sum_{i \in S} w_i = N$$ exactly and the two estimators coincide.)

## IPW with Weighted Least Squares

Like many inferential tasks on the job, regression gives us automatic machinery for both base rate estimation (`incidents ~ 1 + treatment + subgroup + treatment*subgroup` ftw) as well as inference on the regression coefficients (did the treatment actually do shit). Under naive OLS, if you tried running regressions on sampled data where two classes have different inclusion probabilities, then you'd be sure to run into all kinds of estimation problems since the distribution of the sampled data no longer resembles the population it's supposed to represent. I talked about how we can use inverse probability weights to correct for this issue, and it turns out those same weights can be used in a Weighted Least Squares construction to run regressions as we normally would.[^4] (I was genuinely shocked to see WLS actually be put to practical use at my job and mildly regretted skimming over that chapter in my <a href="https://arxiv.org/pdf/2401.00649">linear models textbook</a> two and a half years ago).

Formally, this corresponds to:

$$
\hat\beta_{1/\pi} = \left(\sum_{i \in S} \pi_i^{-1} x_i x_i^{\mathrm{T}}\right)^{-1} \sum_{i \in S} \pi_i^{-1} x_i y_i,
$$

where $$\pi_i$$ is the sampling inclusion probability for unit $$i$$. Weighting each observation by $$\pi_i^{-1}$$ recovers the population-level normal equations in expectation (here $$I_i$$ is the population-level inclusion indicator, so $$I_i = 1$$ exactly when $$i \in S$$), since

$$
E\left(\sum_{i=1}^N \frac{I_i}{\pi_i} x_i x_i^{\mathrm{T}} \,\middle|\, X_N, Y_N\right) = \sum_{i=1}^N x_i x_i^{\mathrm{T}}, \qquad E\left(\sum_{i=1}^N \frac{I_i}{\pi_i} x_i y_i \,\middle|\, X_N, Y_N\right) = \sum_{i=1}^N x_i y_i.
$$

Note that this construction uses the same inverse-probability weights as the HT estimator, but interestingly, the Hájek estimator would recover the same WLS estimate for $$\hat\beta_{1/\pi}$$. Unlike in the population-mean problem from earlier, rescaling all the weights $$\frac{1}{\pi_i}$$ by a common factor like $$\left(\frac{1}{N}\sum_{j \in S} \pi_j^{-1}\right)^{-1}$$ cancels from both sides of the WLS normal equations. (I've attached a small proof below if you are interested.)

<details>
<summary><b>View Proof</b></summary>

First, WLS is invariant to any common rescaling of its weights. Suppose that

$$w_i^* = cw_i$$

for some scalar c > 0. Then,

$$
\begin{aligned}
\hat\beta^*
&=
\left(\sum_{i \in S} cw_i x_i x_i^{\mathrm T}\right)^{-1}
\left(\sum_{i \in S} cw_i x_i y_i\right) \\
&=
\frac{1}{c}
\left(\sum_{i \in S} w_i x_i x_i^{\mathrm T}\right)^{-1}
c\left(\sum_{i \in S} w_i x_i y_i\right) \\
&=
\hat\beta.
\end{aligned}
$$

Now let the original inverse-probability weights be

$$
w_i = \frac{1}{\pi_i}
$$

The Hájek-normalized versions can be written as

$$
w_i^H
=
\frac{w_i}{\frac{1}{N}\sum_{j \in S} w_j}
=
\left(\frac{1}{N}\sum_{j \in S} w_j\right)^{-1}w_i
$$

If we define

$$
c =
\left(\frac{1}{N}\sum_{j \in S} w_j\right)^{-1}
$$

then $$w_i^H = cw_i$$ for every observation $$i \in S$$

Since multiplying all WLS weights by the same scalar does not change the coefficient estimate,

$$
\hat\beta_H = \hat\beta_{1/\pi}
$$

Therefore, Hájek-normalizing the inverse-probability weights produces exactly the same WLS coefficient estimate as using the original inverse-probability weights.</details>

Now, for WLS, while the estimated coefficients are generally consistent under standard regularity conditions for the population regression coefficients (but not unbiased in finite samples), the *standard errors* that come out of a default WLS routine are wrong. Default WLS assumes the weights are *precision* weights, i.e. that $$\text{Var}(\varepsilon_i) = \sigma^2 / w_i$$, but our weights $$w_i = \frac{1}{\pi_i}$$ are *sampling* weights, so a non-incident receiving weight 100 doesn't have an error variance 100 times smaller than an incident receiving weight 1.

One option is to treat this as a weighted estimating-equation problem and use heteroskedasticity-robust Eicker-Huber-White standard errors, rather than the default WLS covariance estimator:

$$
\widehat{\text{Var}}(\hat\beta_{1/\pi}) = \left(\sum_{i \in S} w_i x_i x_i^{\mathrm{T}}\right)^{-1} \left(\sum_{i \in S} w_i^2 \hat\varepsilon_i^2 \, x_i x_i^{\mathrm{T}}\right) \left(\sum_{i \in S} w_i x_i x_i^{\mathrm{T}}\right)^{-1},
$$

where $$w_i = \pi_i^{-1}$$ and $$\hat\varepsilon_i = y_i - x_i^{\mathrm{T}}\hat\beta_{1/\pi}$$.[^5]

This sandwich estimator treats the sampled rows as independent observations and gives us model-robust inference for the weighted estimating equation rather than relying on the precision-weight interpretation of WLS. If the same individual shows up in multiple rows, we'd instead want to cluster the sandwich estimator at the individual level.

One more caveat: because we actually know the sampling design, we can go a step further and use a design-based survey variance estimator that explicitly accounts for how observations entered the sample. In our setup, incidents are certainty units with $$\pi_i=1$$ while non-incidents are sampled with $$\pi_i=0.01$$. A proper survey variance estimator can incorporate that structure, along with features like sampling without replacement, stratification, or clustering. The generic robust sandwich estimator above doesn't automatically incorporate all of those design features, so it shouldn't be interpreted as identical to the fully design-based variance estimator. But the setting I described with simple independent downsampling is very simple, and the robust sandwich estimator is a convenient way to get model-robust inference for the weighted regression that doesn't mistakenly interpret sampling weights as precision weights.

## A Quick Simulation

Courtesy of ChatGPT, here's some simulation code that shows the downsampling scheme in practice, to show you that I'm Not Crazy™️ and that IPW + WLS Actually Works™️ (<a href="https://colab.research.google.com/drive/1KxSAoO5n22f1ksv2D-wmo4cUxa_OULPs?usp=sharing">Google Colab link</a> in case you want to make a copy and run it).

In the simulation, the population contains 2 million individuals with 3,935 incidents, for a population-level incident rate of 0.1968%. We assign 80% of the population to the treatment group; 30% of the population also belongs to some "Subgroup" (in practice, this can be some sort of customer segment like "power users").

We can then show that IPW estimators yield fairly precise estimates of the population incident rate:

| Estimator | Incident rate |
|---|---:|
| Population | 0.1968% |
| Naive downsample | 16.3672% |
| Horvitz-Thompson | 0.1968% |
| Hájek | 0.1953% |

Unsurprisingly, the naive downsample incident rate estimator is completely fucked; because we retained every incident but only 1% of non-incidents, the raw incident rate jumps from 0.1968% to 16.3672%. On the other hand, both IPW estimators recover the population rate almost perfectly. In fact, the HT estimate recovers it exactly in this particular setup, essentially by construction. Since we retain every incident with probability 1, every observation with $$y_i = 1$$ is included with weight 1, while sampled non-incidents have $$y_i = 0$$ and therefore contribute nothing to the weighted outcome total. Thus,

$$\hat{\tau}_{HT} = \frac{1}{N}\sum_{i\in S}\frac{y_i}{\pi_i} = \frac{\#\text{ incidents}}{N}$$

which is exactly the population incident rate. The Hájek estimate is also extremely close at 0.1953%, but differs slightly because it divides by the *estimated* population size $$\sum_{i \in S} 1 / \pi_i$$, which varies depending on exactly how many non-incidents happen to make it into our 1% sample. (So even though I talked about how an advantage of the Hájek estimator over HT is location invariance, that doesn't apply in this binary outcome setting which makes the unbiasedness of the HT estimator more appealing; it's good to be a methodological pluralist!)

Finally, we validate the downsampling procedure itself: retain all incidents, but take a 1% downsample of non-incidents, and then use inverse probability weights with weighted least squares to show that the WLS coefficients closely match the population quantities for `incidents ~ 1 + treatment + subgroup + treatment*subgroup` with reasonable confidence intervals via HC0 robust standard errors.

<img src="/assets/article_images/2026-09-28-images/downsampling_coeff_comparison.png" alt="Full Data vs. Rare-Event Downsampling + IPW">

And a Monte Carlo simulation across repeated downsamples of the same fixed population for treatment effect estimation to really drive the point home that I'm Not Crazy™️ and that IPW + WLS Actually Works™️.

<img src="/assets/article_images/2026-09-28-images/monte_carlo_ipw_estimates.png" alt="Monte Carlo distribution of treatment effect estimates across repeated downsamples vs. the full-data estimate">

## Closing

Wow, you know the blog is a stinker when even I'm bored writing it, but thanks for scrolling to the end! I'll probably publish more of these methods blogs as I continue working, mostly as a running compendium of niche data science voodoo that's come up on the job. To close out, here's an image that I hacked together that summarizes what the blog is talking about, because inevitably even *I'm* not reading all that if I ever revisit this post in the future.

<img src="/assets/article_images/2026-09-28-images/article_summary.png" alt="Article Summary">


---

#### Footnotes
[^1]: <small>This whole saga was incredibly dumb and both Sacks and Musk demonstrated a pitiful understanding of statistics. I <a href="https://piggybank.substack.com/p/elon-musk-doesnt-understand-statistics">wrote about this</a> four years ago on my old blog (it's paywalled lol but if you want to read it just ask me).</small>
[^2]: <small>Important caveat that this setting is different than, say, the Twitter bot detection setting where we don't know how many bots there are *a priori* and can't just sample all of them since they're not labeled for us.</small>
[^3]: <small>Technically a 1% downsample of 100 data points will not retain 1 data point in all cases; the sampling process is stochastic so the number of sampled points follows a Binomial(100, 0.01) distribution. You will draw 0 points with 36% probability, for example. But overall point still stands.</small>
[^4]: <small>In my particular setting, the outcome is binary, so these regressions correspond to <a href="https://bookdown.org/sarahwerth2024/CategoricalBook/linear-probability-models-r.html">linear probability models</a> and the coefficients are directly interpretable as prevalence rates/differences in prevalence.</small>
[^5]: <small>Fun tidbit for the uninitiated: this is often called the "sandwich" covariance matrix because the outer terms are the same matrix inverse from the point estimate ("the bread"), and the middle term estimates the variance of the weighted score $$w_i x_i \hat\varepsilon_i$$ ("the meat"), which is where the squared weights come in.</small>