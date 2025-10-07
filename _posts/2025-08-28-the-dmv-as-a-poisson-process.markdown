---
layout: post
title:  "The DMV as a Poisson Process"
subtitle: "Forecasting my waiting time ft. Poisson and Gamma distributions"
date:   2025-08-28 11:30:26 -0700
categories: jekyll update
---

I went to the DMV today to get my driver's license renewed. Like many others[^1], I loathe waiting in line at the DMV, and today was no exception, especially because I also was supposed to meet my friend for dinner that evening and I was terrified of being late because I got stuck at the DMV.

To soothe my anxiety, I began trying to forecast around what time I would be called up for the renewal paperwork to get an estimate of what time I could leave after that. I was assigned the ticket number G-193, and by the time I sat down with my mom to wait for our number to be called around 3:32 pm, they had just called G-169 up for their appointment; only 24 numbers to go, lovely!

I started getting worried though, since there were 3 minutes until the next number was called, then 3 minutes after that (2 were called), and then 6 minutes after that. I was not thrilled at the idea of having to wait another hour while tickets got called up 3 minutes at a time. Luckily, the pace began picking up slightly after that.

My ever-diligent mother (without me even asking her) began noting down the times each subsequent number got called, and by 3:58 pm, the 14th ticket since G-169 had been called. With this much data, I figured we could model DMV numbers being called as the number of "arrivals" following a homogeneous Poisson process with rate $$\lambda$$. Since I began recording at the first observed call, the observation window was $$t = 26$$ minutes (from 3:32 pm to 3:58 pm), during which I observed $$n = 14$$ total calls. Therefore the unbiased estimator for $$\lambda$$ is:

$$\hat{\lambda}_1 = \frac{n-1}{T}$$

assuming we fix the number of observations beforehand and stop counting once we observe the $$n^{th}$$ arrival. Alternatively, if we modeled this as counting the number of arrivals in a fixed time interval $$t$$, then the unbiased estimator for $$\lambda$$ is:

$$\hat{\lambda}_2 = \frac{N(t)}{t}$$

**Proof for $$\hat{\lambda}_1$$:**  For a Poisson process with rate $$\lambda_1$$, the interarrival times $$\tau_1, \tau_2, ..., \overset{\text{i.i.d.}}{\sim} \text{Exp}(\lambda_1)$$. [^2]

The total time elapsed until the $$n^{th}$$ arrival is $$T = \sum_{i=1}^n \tau_i$$, and since this is the sum of i.i.d. exponential random variables, $$T$$ follows a Gamma distribution with shape parameter $$n$$ and rate parameter $$\lambda_1$$.

Now, we need an estimator for $$\lambda_1$$. A natural choice of estimator might just be the number of arrivals observed per unit of time (i.e., called ticket numbers per minute), which would be $$\hat{\lambda}_1 = \frac{n}{T}$$.

One potentially nice property for our estimator to have is unbiasedness, for a couple of reasons. The obvious one is that the estimator equals the true parameter in expectation. But a second, more practical reason is that this was just a back-of-the-envelope calculation I did while sitting in the DMV. With such little data, I don’t think it makes sense to adopt a biased estimator since we don’t have any strong prior justification to favor one direction of bias over another.

Anyway, if you take the expectation of our estimator, a problem arises if we want unbiasedness:

$$\mathbb{E}[\hat{\lambda}_1] = \mathbb{E}[\frac{n}{T}]$$
$$= n \cdot \mathbb{E}[\frac{1}{T}]$$

Since $$T \sim \text{Gamma}(n, \lambda_1)$$, the expectation of T's reciprocal is $$\frac{\lambda_1}{(n - 1)}$$.[^3]

So we are left with $$\mathbb{E}[\hat{\lambda}_1] = n \cdot \frac{\lambda_1}{(n - 1)}$$, which is biased upward. Luckily, this just means that if we change our estimator to $$\hat{\lambda}_1 = \frac{n - 1}{T}$$ instead, we get the unbiased estimator we wanted at the beginning.[^4] $$\square$$

**Proof for $$\hat{\lambda}_2$$:** If I had instead pre-specified a fixed time interval over which to log arrivals, then the number of arrivals $$N(t)$$ would be our random variable which follows a $$\text{Poisson}(\lambda_2 t)$$ distribution.

$$\mathbb{E}[N(t)] = \lambda_2 t$$, so a choice of unbiased estimator for $$\hat{\lambda}_2$$ is simply $$\frac{N(t)}{t}$$. $$\square$$

So depending on which strategy you prefer (I don't think there's really a "correct" answer here since it all depends on a strategy I should have specified prior to any data collection), my estimator for $$\lambda$$ is either $$\lambda_1 = \frac{13}{26}$$ or $$\lambda_1 = \frac{14}{26}$$.

Really, neither of these is even "correct" since estimators themselves are random variables, and choosing one estimated from just 14 observed data points is definitely highly crude, but again, this is DMV napkin math.

Anyway, the broader point of this exercise was to forecast approximately when our ticket number would be called, which essentially boils down to generating an interval around the 24th arrival in the given Poisson process.

<a href="https://www.probabilitycourse.com/chapter11/11_1_2_basic_concepts_of_the_poisson_process.php">Arrival times in a Poisson process</a> $$T_n$$ follow a discretized version of the Gamma distribution on the natural numbers $$n \in \mathbb{N}$$ called the $$\text{Erlang}(n, \lambda)$$ distribution. That means the 24th arrival time would be:

$$T_{24} \sim \text{Gamma}(24, \lambda)$$ for $$n = 1, 2, 3, ...$$.

Depending on our choice of estimator for $$\lambda$$, we can say that $$T_{24} \sim \text{Gamma}(24, \frac{13}{26})$$ or $$T_{24} \sim \text{Gamma}(24, \frac{14}{26})$$.

The first one gives us an expected time of arrival of $$\mathbb{E}[T_{24}] = \frac{24}{0.5} = 48$$ minutes (4:20 pm) while the second one gives us an expected time of arrival of $$\mathbb{E}[T_{24}] = \frac{24}{0.538} = 44.571$$ minutes (~4:16-17 pm).

For an 80% confidence interval around the mean to generate our wait-time forecast, we can leverage the fact that for a $$T_{24} \sim \text{Gamma}(24, \lambda)$$ distribution, $$2 \lambda T_{24} \sim \chi^2_{2n} = \chi^2_{48}$$, which we can then use to construct an 80% equal-tailed confidence interval for our waiting time forecast.[^5] (Alternatively, if you're like me and did not know this fact, you can ask ChatGPT to construct the 80% CI of the specified Gamma distribution while you're sitting at the DMV.)

This gives us an 80% confidence interval of $$\left[ \frac{\chi^2_{48, 0.10}}{2 \lambda}, \frac{\chi^2_{48, 0.90}}{2 \lambda} \right]$$.

For $$\hat{\lambda}_1 = \frac{13}{26}$$, that gives us an 80% confidence interval of **[35.95, 60.91] minutes** and for For $$\hat{\lambda}_2 = \frac{14}{26}$$, that gives us an 80% confidence interval of **[33.38, 56.56] minutes**.

Our ticket number finally ended up being called at 4:21 pm, which was 49 minutes after our first observation, so our point forecast for the mean waiting time from the $$T_{24} \sim \text{Gamma}(24, \frac{13}{26})$$ distribution ended up being pretty good! Both 80% confidence intervals contain the true arrival time, so we would favor the narrower one [33.38, 56.56] generated using $$\hat{\lambda}_2 = \frac{14}{26}$$

We can also give our 80% confidence intervals forecasting scores based off of a strictly proper linear scoring rule:[^6]

$$[35.95, 60.91] \rightarrow 0.7504$$

$$[33.38, 56.56] \rightarrow 0.7682$$

So overall, the forecasts were "correct," but also kind of mediocre given their width. With a waiting time of less than 60 minutes (26 of which had already elapsed), there's not much value in having an interval that's 20 minutes long. (That being said, they were both better forecasts than the initial 60-70 minutes I thought it would take after the first few tickets, but even a naive linear extrapolation of 14/26 = 0.538 tickets per minute on average would have gotten me to around 45 minutes of waiting time by the 24th ticket.) I thought this was a fun exercise regardless mostly because of how close to the actual waiting time the mean of the waiting time's Gamma distribution ended up being. Obviously, it's partially coincidence, since my estimate for $$\lambda$$ was very crude and based off of relatively few observations, but there's nothing more validating than telling your mom "I think they're going to call us around 4:20" and being just a minute off.

---

#### Footnotes
[^1]: <small>It looks like actual public opinion polling of the California DMV is sparse, but from whatever limited information I could find online, it seems like the masses view the DMV in a much rosier lens than I would have initially guessed. According to a website called "GovTech" whose credibility I'm moderately skeptical of, <a href="https://insider.govtech.com/california/news/stanford-case-study-examines-positive-changes-at-dmv">public satisfaction with the DMV has increased in recent years and wait times decreased from 1.5 hours in 2018 to 13 minutes in 2021.</a> According to a 2024 Qualtrics survey, <a href="https://www.qualtrics.com/news/these-state-governments-offer-the-best-customer-service">69% of people were at least satisfied with the DMV</a>; 88 percent of North Dakotans said they were at least somewhat satisfied while just 3 percent of Hawaiians said the same thing. I guess that leaves somewhere between 3 and 88 percent of Californians who are satisfied with the DMV.</small>
[^2]: <small>This follows from a <a href="https://www.probabilitycourse.com/chapter11/11_1_2_basic_concepts_of_the_poisson_process.php#:~:text=Arrival%20and%20Interarrival%20Times%3A">useful fact</a> about Poisson processes, which is that interarrival times are exponentially distributed with mean $$\frac{1}{\lambda}$$.</small>
[^3]: <small>This also follows from a <a href="https://stats.stackexchange.com/questions/139467/expected-value-of-y-1-x-where-x-sim-gamma">useful Gamma fact</a> that I found courtesy of Stats Stack Exchange.</small>
[^4]: <small>Note that this only holds for $$n > 1$$</small>
[^5]: <small>Note that an equal-tailed confidence interval is not necessarily the narrowest interval containing the parameter with the specified probability. You would need a Bayesian highest posterior density credible interval for that. Related to that, there's no reason a priori why my forecasting interval needed to be frequentist either; generating a confidence interval gives an asymptotic guarantee on coverage, but it's totally fine to use a narrower, subjective interval like 40-50 minutes if we have a strong prior on expected wait times, provided we are calibrated.</small>
[^6]: <small>I use scoring rule $$S(49, L, U) = 1 - \left[ \frac{1 - 0.8}{2} \frac{(U - L)}{10} + \begin{cases} 
      \frac{L - 49}{10}, & 49 < L \\
      0, & L \leq 49 \leq U \\
      \frac{49 - U}{10}, & x > U 
   \end{cases} \right]$$</small>