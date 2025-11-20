---
layout: post
title:  "Make Sure You Know What a Confidence Interval Is"
subtitle: "Because your doctor might not!"
date:   2025-11-19 00:00:00 -0500
categories: jekyll update
---

**Table of contents:**
[Do Doctors Suck at Statistics?](#do-doctors-suck-at-statistics) | [Okay, Exposition Aside, What is a Confidence Interval?](#okay-exposition-aside-what-is-a-confidence-interval) | [So Can We Actually Make Probabilistic Statements About Single Intervals?](#so-can-we-actually-make-probabilistic-statements-about-single-intervals) | [So Why Don't We Just Teach the Bayesian Interpretation in Intro Stats?](#so-why-dont-we-just-teach-the-bayesian-interpretation-in-intro-stats) | [Bonus: My Sister's Chemistry Professor Doesn't Know What a Confidence Interval Is](#bonus-my-sisters-chemistry-professor-doesnt-know-what-a-confidence-interval-is) | [Bonus: Do My Friends Know What a Confidence Interval Is?](#bonus-do-my-friends-know-what-a-confidence-interval-is) | [Bonus: Some Bayesian Inference](#bonus-some-bayesian-inference)

## Do Doctors Suck at Statistics?

It’s kind of become a running gag in stats-world that doctors don’t really understand statistics. I’m reminded of <a href="https://data88s.org/textbook/content/Chapter_02/04_Use_and_Interpretation.html#:~:text=that%20are%20involved.-,2.4.1.%20Harvard%20Medical%20School%20Survey,-%23">various studies</a> where the <a href="https://blogs.cornell.edu/info2040/2014/11/12/doctors-dont-know-bayes-theorem/comment-page-1/">majority of doctors failed to answer a fairly simple question</a> related to breast cancer screening and conditional probability:[^1]

> Assume you conduct breast cancer screening using mammography in a certain region. You know the following information about the women in this region: 
* The probability that a woman has breast cancer is 1% (prevalence) 
* If a woman has breast cancer, the probability that she tests positive is 90% (sensitivity) 
* If a woman does not have breast cancer, the probability that she nevertheless tests positive is 9% (false-positive rate)

> A woman tests positive. She wants to know from you whether that means that she has breast cancer for sure, or what the chances are. What is the best answer?
* (A.) The probability that she has breast cancer is about 81%.
* (B.) Out of 10 women with a positive mammogram, about 9 have breast cancer. 
* (C.) Out of 10 women with a positive mammogram, about 1 has breast cancer. 
* (D.) The probability that she has breast cancer is about 1%.

Generally, I think statisticians get a bit too smug about these studies and use them to imply that doctors are not intelligent or don’t know “basic math.” Thinking about the problem in terms of conditional probability is actually not that intuitive at first, and in fact, when doctors are trained on how to think about these problems, almost <a href="https://www.stat.berkeley.edu/~aldous/157/Papers/health_stats.pdf">90% of them are able to answer correctly</a>!

So this article is not going to be about bashing doctors or calling them stupid – I reserve that type of dunking for the LinkedIn data-slop industrial complex that peddles <a href="https://www.linkedin.com/posts/karunt_linear-regression-looks-simple-however-it-activity-7389828462410248193-flko?utm_source=share&utm_medium=member_desktop&rcm=ACoAACzMCjkB63jB6JFYNYaYPn3jwytTEY5HbKs">bad stats takes about testing for the assumptions of linear regression</a>.[^2] There’s no need to insult when educating doctors who may not even have any statistical training[^3] is empirically effective!

However, there is *one* exception I am making to this rule – doctors who talk about clinical trials should know how to actually interpret them, especially if they want to then hop on twitter dot com to spread AI-generated slop that misinforms people.

In a now-deleted tweet, I saw a doctor post this statement about interpreting confidence intervals in a clinical trial:

<img src="/assets/article_images/2025-11-19-images/deleted_ci_tweet.png" alt="A now-deleted tweet that incorrectly interprets what a confidence interval for hazard ratios is." title="A now-deleted tweet that incorrectly interprets what a confidence interval for hazard ratios is." height="500">

I will say that I don’t necessarily blame this doctor for not knowing the actual correct interpretation of what a confidence interval is, because I think a lot of people may not understand how to interpret a confidence interval even after taking an introductory statistics course. That being said, if you don’t understand something, you shouldn’t be hopping on Al Gore's Internet to try and educate people on said thing.

## Okay, Exposition Aside, What is a Confidence Interval?

It might be actually easier to start with what a confidence interval is not. The most common naive interpretation is that an X% confidence interval means there is an X% chance that the interval contains the true parameter you are trying to estimate. So for example, if you wanted to know the <a href="https://www.statisticalaid.com/hazard-ratio/">hazard ratio</a> of a treatment for a certain illness (roughly speaking, HR < 1 implies a protective effect on the treatment group, HR > 1 implies the treatment group experiences symptoms more often), and you obtained a 95% confidence interval of (0.60, 0.92), a common misinterpretation would be that there is a 95% chance that the true hazard ratio falls in that interval.

Confidence intervals are a frequentist construct, and in frequentism, the main assumption is that parameters (like the “true” hazard ratio) are fixed quantities, and when we obtain a sample, we are merely estimating this true fixed quantity with some degree of error or uncertainty due the randomness in our sample. Because the true parameter is fixed, the confidence interval we construct based on our data either contains the parameter or doesn’t – so effectively, the probability that the confidence interval contains the “true” parameter value is either 0 or 1.

So why bother with a confidence interval then? What does 95% mean? What exactly are we “confident” about?

A confidence interval represents an asymptotic guarantee on the process used to generate the interval. Given that the sample you used to construct the interval was random, had you drawn a different sample, you would obtain a different confidence interval even if you used the exact same estimation strategy and methodology as before. And if you drew yet another sample, you would obtain yet another confidence interval.

And because each sample is random, there’s also a chance you might accidentally discover a “true effect”[^4] in the data – for example, that the hazard ratio is less than 1 – not because there actually is some “true effect,” but because you got a lucky draw of individuals in your sample that led to a spurious discovery. This is exactly what a false positive (<a href="https://en.wikipedia.org/wiki/Type_I_and_type_II_errors">or Type I error</a>) is.

Controlling that false positive rate is important, and ideally, you’d like some sort of asymptotic guarantee that over a series of many hypothetical redraws of your sample, you would only make a Type I error some X% of the time. That’s exactly what a confidence interval is a guarantee on. A 95% confidence interval is telling you that in the limit of drawing samples and constructing intervals for your estimate of the true parameter, the true parameter is guaranteed to fall within or be “covered by” 95% of those intervals you generate. So in other words, if you keep redrawing data and constructing confidence intervals, you are controlling your false positive rate to be just 5% in the long run.

Here is a <a href="https://en.wikipedia.org/wiki/Confidence_interval">good picture from Wikipedia</a> to visualize what confidence intervals actually do. I've also provided some code (plotting function courtesy of Prof. Dan Nicolae at UChicago!) to recreate a similar image for 95% CIs if you want to try simulating it for yourself!

<details>
<summary><b>View Code</b></summary>
{% highlight python %}
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
plt.style.use('fivethirtyeight')

import warnings
warnings.simplefilter('ignore', FutureWarning)

def plot_some_dots(means, errorbars, truemean, title="Title"):
    '''Plots dot plot with means on y, error bars on y of width
    errorbars, and a line at the value truemean.  If the errorbars
    fail to contain truemean, the dot plot is overwritten with 
    red errorbars.'''
# These two lines test that the inputs are of the right shape
    assert len(means) == len(errorbars) # Must provide one errorbar for each mean
# plot all the dots black
    plt.figure(figsize=(12,4))
    plt.errorbar(range(len(means)), means, errorbars, fmt=".k", capsize=5, ecolor="black", linewidth=3)
# find the points that contain the true mean
    outsideindexes = np.where( (means - errorbars > truemean ) | 
                               (means + errorbars < truemean ))[0]  
    outsidemeans = means[outsideindexes]
    outsidebars = errorbars[outsideindexes]
# plot some of the dots red:
    plt.errorbar(outsideindexes, outsidemeans, outsidebars, fmt=".k", capsize=5, ecolor="red", linewidth=3)
    plt.plot([0, len(means)], [truemean, truemean], color="darkred")
    plt.xlabel("Sample")
    plt.title(title)

np.random.seed(123)

# Normal distribution parameters - feel free to change!
mu = 10
sigma = 4
n = 30

num_samples = 100
means = np.array([])
widths = np.array([])
for i in range(num_samples):
    
    # Step 1: draw one sample from N(mu, sigma^2)
    sample_i = np.random.normal(loc=mu, scale=sigma, size=n)
    mu_hat_i = np.mean(sample_i)
    means = np.append(means, mu_hat_i)
    
    # Step 2: bootstrap this sample to get the distribution of the mean
    bootstrap_means = np.array([])
    for b in range(10_000):
        bootstrap_sample = np.random.choice(sample_i, size=n, replace=True)
        bootstrap_means = np.append(bootstrap_means, np.mean(bootstrap_sample))
    
    # Step 3: construct symmetric CI around mu_hat_i
    diffs = bootstrap_means - mu_hat_i
    w_i = np.quantile(np.abs(diffs), 0.95)
    widths = np.append(widths, w_i)

    # You can also construct a CI using the quantiles of the normal distribution
    # But this CI may not be symmetric
    # ci_lower = np.quantile(bootstrap_means, 0.025)
    # ci_upper = np.quantile(bootstrap_means, 0.975)

plot_some_dots(means, widths, truemean=10, title="100 bootstrap 95% CIs for the mean")

outside_indexes = np.where((means - widths > 10) | (means + widths < 10))[0]
num_miss = len(outside_indexes)
print(f"Number of intervals that do not contain 10: {num_miss}")
{% endhighlight %}
</details>

![Wikipedia depiction of a 50% Confidence Interva – asymptotically 50% coverage of the true parameter by repeatedly sampling and constructing confidence intervals.](/assets/article_images/2025-11-19-images/wiki_50_pct_ci.png "Wikipedia depiction of a 50% Confidence Interva – asymptotically 50% coverage of the true parameter by repeatedly sampling and constructing confidence intervals.")

> Each row of points is a sample from the same normal distribution. The colored lines are 50% confidence intervals for the population mean $$\mu$$. At the center of each interval is the sample mean $$\bar{x}$$, marked with a diamond. The blue intervals contain $$\mu$$, and the red ones do not.

So back to the original tweet. What makes it wrong? It’s talking about running the trial 100 times over and over again, so it is making some sort of asymptotic argument:

“If we ran the trial 100 times, in 95 of them, the true effect would fall between 0.55 and 0.94.”

The issue lies in the second part of the claim: “the true effect would fall between 0.55 and 0.94.” (A more minor nitpick would be that even if the second part was corrected, it may not be exactly 95 intervals that contain the true effect; we would expect  – i.e., on average we would find – 95 of them to contain the true effect.)

This is the confidence interval generated from one sample draw, and it should be clear by now that confidence intervals don’t provide any guarantee on the values of the interval from one particular draw. In fact, the only thing we can say about one particular interval, in the frequentist sense, is that it either does or does not contain the “true effect.”

The correct interpretation of this confidence interval is something more like, “We used a procedure that, if repeated across many samples from the same population, would produce intervals that contain the true hazard ratio 95% of the time. The interval [0.55, 0.94] was generated by this procedure from our sample. We cannot know whether this particular interval contains the true value, but the method is reliable in the long run.”

If you think this interpretation of a confidence interval is too complicated, uninformative, and overall kind of sucks, you’re not alone! It’s actually a very unintuitive construct because the only argument about probability it’s making is about the long-run behavior of the procedure itself, not the relationship between the given interval and the true unknown parameter. Confidence intervals themselves don’t have any profound ontological status, and are mostly used as a form of popular convention (although, to be fair, a convention that still makes sense) rather than any intrinsically strong property of using them.

## So Can We Actually Make Probabilistic Statements About Single Intervals?

Actually, we can! You just need a completely different framework of how you think about probability.

Consider a very simple thought experiment: let’s say you’re shopping online for a new smoothie blender, and you come across two brands:
* **Smoothie Samurai**, which has 19 reviews and a 95% average rating.
* **The Destroyer**, which has 3 reviews and a 100% average rating.

Which one would you buy?

I think the overwhelming majority of people would probably prefer Smoothie Samurai, because of the two options, it seems to be more “vetted” and has a mostly positive rating with more reviews.

But does this rationale make sense from a frequentist perspective of probability?

Let’s say you are a frequentism absolutist, and you want to select the blender which has the highest “true” rating (let’s assume for simplicity that the averaged reviews of several buyers will eventually converge to the “true” rating of the blender, which reflects its quality). The only way you can determine this is to estimate this value from data. Which means you’re essentially forced to say that The Destroyer is the better blender – it has a higher mean rating and no variance in those ratings. This is essentially analogous to taking the maximum likelihood estimate of the average rating across the two blenders and selecting the blender with the higher MLE.

Obviously, you can rebut that the fact that the 100% rating comes from only 3 reviews makes the average rating of The Destroyer highly uncertain. But fundamentally, what you’re arguing is that the sample size of the data should affect your estimate of the true average blender rating, and not just the actual data itself.

What you’ve done is basically incorporate your own subjective belief about “the way the world works” (a prior, if you will) and you’ve adjusted your estimate for what the true highest-rated blender will be based on this prior. Is what you’ve done unreasonable? Certainly not! Your belief is informed by the fact that products with fewer reviews may have less reliable estimates of product quality. But it’s a fundamentally different estimation task than what is allowed by frequentism.

In other words, you’ve become a Bayesian.

Why work through this toy example? Mostly to help you shake off the bad taste of imposing a prior or incorporating “subjective beliefs” in your estimates. It’s common for people – including people who study stats! – to recoil at the idea of introducing any notion of subjectivity into what is “supposed” to be an “objective” process. But in reality, our understanding of the world can be greatly improved by incorporating beliefs about what we strongly believe to be true when we make judgments from data. They might not admit it, but frequentists do this too; you can fairly easily argue that imposing a statistical significance level like $$\alpha = 0.05$$ is just being Bayesian with extra steps.

Anyway, once you convince yourself that having prior beliefs is okay, your world really really opens up! With Bayesian inference, you can start to make statements like “there is a 95% chance that the parameter will fall in the interval we have constructed.”

We can make claims like this because in Bayesian inference, we treat our unknown parameters as random variables, as opposed to frequentist inference where they are treated as fixed quantities like with confidence intervals. Since random variables have some probability density over the observed data, we can make claims about what’s probabilistically likely about our estimated parameter given our observed data (think of a random variable that’s normally distributed – it’s a common refrain that around 68% of the data will fall within 1 standard deviation of the mean, and around 95% of the data will fall within 2 standard deviations of the mean).

In Bayesian inference, we call these <a href="https://en.wikipedia.org/wiki/Credible_interval">**credible intervals**</a>; given we compute the posterior distribution of the parameter we are trying to estimate, a $$p\%$$ credible interval is constructed such that the parameter has a $$p\%$$ chance of falling within that interval. So for example, if I was trying to estimate the hazard ratio of a treatment for a certain illness and I obtained a 95% *credible interval* of (0.60, 0.92), then I would be correct by interpreting this as "there is a 95% probability that the hazard ratio is between 0.60 and 0.92 under my model." How lovely is that? Notably, credible sets are not unique (I can find an infinite number of intervals under my posterior distribution that contain 95% of the probability density) and also depend on your choice of prior, but we typically choose something like the smallest credible set which contains $$p\%$$ of the posterior probability density.

## So Why Don't We Just Teach the Bayesian Interpretation in Intro Stats?

The reason I don't think Bayesian inference and credible intervals are taught in intro stats is fairly simple: they're too hard to understand. No, I don't mean the actual interpretation of credible interval; that's the easy part. I mean setting up a Bayesian modeling problem and conducting posterior inference. If you check the bonus section of this blogpost, you'll see what I mean. Often times, Bayesian inference problems can only be solved with heavy computation and complicated sampling methods due to mathematical formulations that are literally intractable analytically, and they also involve some fairly dense probability theory that no kid in AP Stats is going to make head or tail of. (Like come on, these kids are just taking their first calculus class at best, and now we're telling them that certain types of integrals are literally impossible to solve without loading up a computer.)

On a second, more abstract level, teaching probability from the Bayesian perspective – that probability represents "subjective belief" in an event happening – might run the risk of making high school kids think that "probability is whatever I say it is" or something along the lines of "the probability is 50-50, either happens or doesn't." This fear is definitely not grounded in any evidence (just a hunch I have), but I will say that teaching probability from the frequentist view (defining probability in terms of long run frequency of events in repeated trials) probably instills more solid fundamentals and a better mental model for probability early on. They can learn the Bayesian perspective later, as a treat.

Doesn't that mean we're stuck with kids in intro stats still not knowing what a confidence interval is? Well, yeah, probably. This I don't know how to reconcile, other than you better hope you have a professor who is a master of pedagogy and knows what they're talking about.

If someone figures out a way to introduce Bayesian inference at an intro-stats level, please let me know!

## Bonus: My Sister's Chemistry Professor Doesn't Know What a Confidence Interval Is

I've actually been sitting on writing this blogpost for almost a year now; the bad medical tweet was helpful inspiration to finally get moving on it, but the *original* inspiration was a question my sister's college chemistry professor gave them on a take-home quiz that she showed me:

![My sister's take home chemistry question: Which of the following best represents what the 95% Confidence Interval represents? The correct answer is none of them, which wasn't an answer choice.](/assets/article_images/2025-11-19-images/chemistry_quiz.png "My sister's take home chemistry question: Which of the following best represents what the 95% Confidence Interval represents? The correct answer is none of them, which wasn't an answer choice.")

Her chemistry professor makes the same textbook error that the doctor from Twitter made! I'm *guessing* he wants his students to select option (B): "There is a 95% chance the true (actual value) lies within 3.34-3.58," but this is wrong! This is not what a confidence interval is! The chance that the true value lies within this one confidence interval in particular is either 100% or 0%; the true value is a fixed number, and the interval either contains this number or it doesn't, so it doesn't even make sense to talk about it in terms of probability. As we've talked about, this 95% confidence interval *akshually* means that if we were to repeat the sampling process many times and construct a confidence interval each time using this same procedure, 95% of those intervals would contain the true parameter value; the interval (3.34, 3.58) is one particular interval computed from our particular sample data instantiation.

Is it a mouthful? Yes. But it's still correct. I don't understand how you can be a science professor at *Yale University* and fail to teach your students – many of whom will conduct lab experiments in the future – what a confidence interval actually is. Very disappointing!

## Bonus: Do My Friends Know What a Confidence Interval Is?

I guess we'll never know, since only two people responded to the Google Form I sent out. Thank you, friends!

Both of them have taken an intro probability and statistics in college, which is great for what I wanted to investigate: are they able to correctly define what a confidence interval with just intro stats training?

To be honest, their answers were better than I thought they would be when I sent the form out, but still slightly wrong. The first question was asked as follows:

> Researchers run a randomized trial of a new drug to prevent heart attacks. They define the effect of the drug as the reduction in 5-year heart attack risk compared with no treatment. In this study, the estimated risk reduction is 0.30 (30 percentage points), and the 95% confidence interval for the risk reduction is [0.22, 0.38]. In your own words, how would you interpret this 95% confidence interval in context?

Interestingly, both of them used phrasing which I consider to be somewhat circular but also *technically* correct. Friend 1 said, "The researchers are 95% confident that the actual risk reduction is somewhere between 22% and 38%," while Friend 2 said, "We are 95% confident that this sample's range [0.22, 0.38] captures the true reduction in 5-year heart attack risk."

When talking about confidence intervals, stating "we are X% confident" has become the predominant cop-out phrasing for professors who want to avoid actually teaching what confidence intervals are; it's not technically *wrong* – here, "confident" is implied to refer to the long-run coverage property of confidence intervals rather than anything probabilistic about one particular interval – but I have a suspicion that the average student in intro stats is not yet equipped with the knowledge to distinguish between this "confidence" construct and "probability" or "chance."

Friend 2 makes a subtle error; they also use the "95% confident" phrasing (which, again, I find to be kind of circular - define confident!), but the actual interval [0.22, 0.38] has no probabilistic or even "confidence" relationship to the true 5-year reduction in heart attack risk. The only thing we can really say about it is since we are using a procedure which is reliable in the long-run with 95% coverage of the true parameter, we can trust that this particular interval [0.22, 0.38] was generated by a trustworthy method, even though we cannot make probabilistic claims about this specific interval.

I also asked a second question on the survey:

> How would you define what a 95% confidence interval is?

Again, I found it interesting that both my friends evoked the *language* of "long run probability," which is at least directionally correct, but they still missed the correct definition of a confidence interval. In fact, both of them made the exact same mistake as the doctor in the original tweet!

Friend 1 says: "If the same study was done 100 times, 95 out of 100 times, the actual value would be within that range." Minor nitpick is that "95 out of 100 times" is only in expectation, not a deterministic guarantee, but other than that, the only incorrect part of this definition is the second part: "the actual value would be within that range." Remember, the confidence interval is itself a random variable since "each time the study is done", we calculate the sample mean and interval lower/upper bounds using different randomly sampled datasets. So, [0.22, 0.38]  is just one particular confidence interval we obtain with one particular realization of the data (in fact, it's highly, highly unlikely we obtain this same confidence interval in a "repeat" of this study). What's actually true is that we would *expect* the true parameter to lie within 95 out of 100 intervals we generate by repeating the study, with each interval being different.

Friend 2 leaves a funny comment: "With many repeated samples, the calculated interval would capture the true parameter 95% of the time. There's probably different sects of statistics that interpret something as fundamental as CIs differently. They're all nerds 🤓".

Friend 2 also leaves this funny meme below, which unfortunately I must disagree with. (The midwit wins again!)

![Midwit Meme Explaining What a Confidence Interval Is](/assets/article_images/2025-11-19-images/ci_midwit.png "Midwit Meme Explaining What a Confidence Interval Is")

The first sentence is the same error Friend 1 made; Friend 2 gets the "many repeated samples" part exactly correct, but incorrectly ascribes the coverage of the true parameter to *one* particular confidence interval rather than a fraction of all generated intervals. It's subtle, but it's an important distinction. Friend 2 also makes a good point that different schools of thought within statistics (who are all certainly nerds, I agree) might interpret confidence intervals differently; this is sort of true, in that confidence intervals come from the frequentist school of thought on uncertainty quantification, while Bayesians use credible intervals for uncertainty quantification.

I think the midwit meme is funny! The midwit is correct, though; we should be careful about what we mean by "probably." Any statement of "probability" should be about the *procedure* of generating the confidence interval, not the interval itself. It's still "probably" safe to trust a single confidence interval given the probabilistic guarantee provided by the procedure, but we can't make any probabilistic statement about the relationship between one single interval and the true parameter we are trying to estimate.

As one last piece, I think Berkeley's Data 8 is the best introductory statistics class in the country (possibly in the world), and their approach to teaching confidence intervals computationally is actually really illuminating in driving the "procedure" point home. They make it <a href="https://inferentialthinking.com/chapters/13/4/using-confidence-intervals/">clear in the textbook</a> to push back agaisnt what they call the "dismayingly common misuse" of probabilistic statements for confidence intervals!


## Bonus: Some Bayesian Inference

It might be worth it to demonstrate how to actually use Bayesian inference with a concrete example (courtesy of Data 102 at Berkeley!).

Let's say that we are trying to estimate the COVID infection risk in households, and that susceptible individuals get infected with probability $$\theta_i$$. We have the following data from 12 studies that consider the number of individuals in the study susceptible to COVID ($$N_i$$) and the number of them that actually became infected ($$X_i$$).

From these numbers, we can come up with some naive (frequentist) estimates for $$\theta_i$$ by simply computing $$\frac{X_i}{N_i}$$ for each study.

<table>
  <thead>
    <tr>
      <th><strong>Study #</strong></th>
      <th><strong>$$X_i$$</strong></th>
      <th><strong>$$N_i$$</strong></th>
      <th><strong>$$\hat{\theta}_{i}^{naive}$$</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>3</td>
      <td>8</td>
      <td>0.3750</td>
    </tr>
    <tr>
      <td>2</td>
      <td>2</td>
      <td>11</td>
      <td>0.1818</td>
    </tr>
    <tr>
      <td>3</td>
      <td>6</td>
      <td>12</td>
      <td>0.5000</td>
    </tr>
    <tr>
      <td>4</td>
      <td>9</td>
      <td>27</td>
      <td>0.3333</td>
    </tr>
    <tr>
      <td>5</td>
      <td>11</td>
      <td>38</td>
      <td>0.2895</td>
    </tr>
    <tr>
      <td>6</td>
      <td>21</td>
      <td>59</td>
      <td>0.3559</td>
    </tr>
    <tr>
      <td>7</td>
      <td>27</td>
      <td>79</td>
      <td>0.3418</td>
    </tr>
    <tr>
      <td>8</td>
      <td>23</td>
      <td>82</td>
      <td>0.2805</td>
    </tr>
    <tr>
      <td>9</td>
      <td>26</td>
      <td>120</td>
      <td>0.2167</td>
    </tr>
    <tr>
      <td>10</td>
      <td>57</td>
      <td>145</td>
      <td>0.3931</td>
    </tr>
    <tr>
      <td>11</td>
      <td>118</td>
      <td>262</td>
      <td>0.4504</td>
    </tr>
    <tr>
      <td>12</td>
      <td>122</td>
      <td>341</td>
      <td>0.3578</td>
    </tr>
  </tbody>
</table>

Because these studies vary so greatly in sample size, we get very different estimates for our parameter $$\theta_i$$. From this data, the infection rate can be as low as $$0.1818 (N_i = 11)$$ or as high as $$0.5 (N_i = 12)$$. If we were frequentists, we could calculate a pooled maximum likelihood estimate $$\hat{\theta}^{MLE}$$, which (hopefully fairly intuitively)[^5] should be the sum of all infected individuals divided by the sum of all susceptible individuals across all studies: $$\hat{\theta}^{MLE} = \frac{\sum_i X_i}{\sum_i N_i} = \frac{425}{922} = 0.359$$. (This assumes the same fixed $$\theta$$ across all 12 studies.)

But can we do better? Ideally, we should find a way to estimate $$\theta_i$$ in a way that places more weight on larger studies while not outright ignoring evidence from these smaller studies.

If we're approaching this problem as Bayesians, we can first start by specifying a probability model: we want to model the probability of contracting a COVID infection $$\theta_i$$ conditional on our observed data $$X_i$$: $$p(\theta_i \mid X_i)$$, which is called the **posterior distribution** of parameter $$\theta_i$$.

Using Bayes' Rule, we can expand our posterior as: $$p(\theta_i \mid X_i) = \frac{p(X_i \mid \theta_i)p(\theta_i)}{p(X_i)}$$

Let's start with $$p(X_i \mid \theta_i)$$, which is called the **likelihood function**. This encodes our belief about the distribution of the data conditional on knowing the parameter $$\theta$$. The likelihood here is actually the same as the likelihood under frequentist inference; if a susceptible individual has probability $$\theta$$ of contracting COVID, this has distribution $$\text{Bernoulli}(\theta)$$, and summing over $$N_i$$ individuals (i.e., summing over $$N_i$$ Bernoulli random variables), $$X_i \mid \theta$$ has distribution $$\text{Binomial}(N_i, \theta)$$, giving us Binomial likelihood $$p(X_i \mid \theta_i) = \binom{N_i}{X_i} \theta_i^{X_i}(1-\theta_i)^{N_i - X_i}$$.

Now, we need to specify $$p(\theta_i)$$, which is a **prior distribution** over our parameter $$\theta_i$$. Since $$\theta_i$$ is a probability, it is bounded between 0 and 1, so ideally, we'd like to specify a probability distribution that has support on this interval. One such choice is a <a href="https://en.wikipedia.org/wiki/Beta_distribution">Beta distribution</a>, which is parametrized by an $$\alpha$$ and $$\beta$$ parameter which can be thought of as a "number of successes" and "number of failures" parameter, respectively; the larger these parameters, the "stronger" the influence of the prior is in our model. Importantly, I am not choosing the $$\text{Beta}(\alpha, \beta)$$ distribution on accident/arbitrarily (more on this in a second); in practice, a good prior should ideally have some sort of *scientific* justification rather than purely *probabilistic*, but this is still a reasonable choice of prior for this toy example.

The $$\text{Beta}(\alpha, \beta)$$ distribution has density $$p(\theta_i) = \theta_i^{\alpha-1}(1-\theta_i)^{\beta-1} \frac{\Gamma(\alpha + \beta)}{\Gamma(\alpha)\Gamma(\beta)}$$, where $$\Gamma$$ is the <a href="https://en.wikipedia.org/wiki/Gamma_function">gamma function</a>. Combining with the likelihood function we get the probability model $$p(\theta_i \mid X_i) = \frac{\binom{N_i}{X_i} \theta_i^{X_i}(1-\theta_i)^{N_i - X_i} \theta_i^{\alpha-1}(1-\theta_i)^{\beta-1} \frac{\Gamma(\alpha + \beta)}{\Gamma(\alpha)\Gamma(\beta)}}{p(X_i)}$$

The denominator, sometimes called the **"evidence"**, is the marginal distribution of the observed data; for a particular set of observations $$X_i$$, we can use the marginal distribution to obtain the probability that our model assigns to those values, averaged over all possible values of $$\theta$$. This gives us:

$$ p(X_i) = \int_0^1 \underbrace{p(X_i \mid \theta_i)}_{\text{likelihood}} \,\underbrace{p(\theta_i)}_{\text{prior}} \,d\theta_i$$

$$\implies p(\theta_i \mid X_i) = \frac{\binom{N_i}{X_i} \theta_i^{X_i}(1-\theta_i)^{N_i - X_i} \theta_i^{\alpha-1}(1-\theta_i)^{\beta-1} \frac{\Gamma(\alpha + \beta)}{\Gamma(\alpha)\Gamma(\beta)}}{\int_0^1 p(X_i \mid \theta_i) p(\theta_i) d\theta_i}$$

This ... looks like an abomination. At least at first glance. Luckily, we can leverage a very special relationship between our prior and likelihood to simplify this model significantly. Combining like terms in the numerator:

$$p(\theta_i \mid X_i) = \frac{\binom{N_i}{X_i} \theta_i^{X_i + \alpha - 1}(1-\theta_i)^{N_i - X_i + \beta - 1} \frac{\Gamma(\alpha + \beta)}{\Gamma(\alpha)\Gamma(\beta)}}{\int_0^1 p(X_i \mid \theta_i) p(\theta_i) d\theta_i}$$

What you should notice now is that $$\theta_i^{X_i + \alpha - 1}(1-\theta_i)^{N_i - X_i + \beta - 1}$$ looks very much like another Beta density – specifically, a $$\text{Beta}(X_i + \alpha, N_i - X_i + \beta)$$ distribution – minus the Gamma terms which normalize the density to integrate to 1. Since that Gamma term is just a scaling factor which doesn't depend on the parameter $$\theta$$, we can state that the numerator is *proportional* to a Beta distribution, up to a normalizing constant:

$$p(X_i \mid \theta_i)p(\theta_i) \propto_{\theta_i} \theta_i^{X_i + \alpha - 1}(1-\theta_i)^{N_i - X_i + \beta - 1}$$

And in fact, in the posterior, the denominator is yet another normalization term that doesn't depend on $$\theta$$, and we can ignore the $$\binom{N_i}{X_i}$$ scaling constant in the numerator for similar reasons. As such, the **posterior distribution itself is proportional to an unnormalized Beta density.**

$$p(\theta_i \mid X_i) = \propto_{\theta}\theta_i^{\alpha + X_i - 1}(1-\theta_i)^{\beta + N_i - X_i - 1}$$

$$\implies p(\theta_i \mid X_i) \sim \text{Beta}(\alpha + X_i, \beta + N_i - X_i)$$

This is very, very convenient for us, because it allows us to perform posterior inference on a well-known distribution, allowing us to compute a closed-form posterior. This wasn't on accident either; the Beta distribution and Binomial distribution are *conjugate* distributions, meaning that when we use a Beta prior with Binomial likelihood, under conjugacy, our posterior distribution will have the same distribution as the prior – hence why we chose a Beta prior. This need not be the case, of course, but without conjugacy, we would be forced to deal with that <a href="https://www.youtube.com/watch?v=R2-yomhYAj4">gnarly</a> integral in the denominator, which in high dimensions is usually intractable and we'd have to use approximate inference by sampling from the posterior with some sort of algorithm (typically, <a href="https://en.wikipedia.org/wiki/Hamiltonian_Monte_Carlo">Hamiltonian Monte Carlo</a> is used).[^6]

Now let's try actually constructing this model; we'll start by choosing suitable *hyperpriors* $$\alpha$$ and $$\beta$$ for our Beta prior. Note that these parameters could also themselves be random variables, but we're fixing them for simplicity. You can interact with this widget to see what happens when you change values of $$\alpha$$ and $$\beta$$.[^7]

<iframe src="/assets/beta_prior.html"
        width="900"
        height="600"
        style="border:none; overflow:hidden;">
</iframe>

Check out what happens when we have a $$\text{Beta}(1, 1)$$ prior, for example. The Beta distribution is completely flat over its support; in fact, the $$\text{Beta}(1, 1)$$ prior is equivalent to the $$\text{Uniform}(0, 1)$$ distribution, which would be equivalent to constructing a completely uninformative prior for our parameter $$\theta_i$$. If we chose a completely uninformative prior, then our posterior mode using Bayesian inference (called the *Maximum A Posteriori* (MAP) estimate) is exactly equal to our maximum likelihood estimate using frequentist inference.

Let's (rather unscientifically) choose a $$p(\theta_i) \sim \text{Beta(2, 4)}$$ prior, since that implies an expected $$\theta_i$$ value of $$2/6 = 0.333$$ which is kind of an eyeballed reasonable estimate of $$\theta_i$$ from each study in our data (and also just a little under our MLE) but also not so strong as to dominate our posterior estimate.

With this choice of prior, since we know that $$p(\theta_i \mid X_i) \sim \text{Beta}(2 + X_i, 4 + N_i - X_i)$$, we can simply *update* our prior based on our observed data to estimate the posterior mean and mode (MAP). (Note that we are calculating the *cumulative* sums of $$X_i$$ and $$N_i$$ here to get pooled estimates, rather than an estimate for $$\theta_i$$ for each study.) And since our posterior has a known distribution (thanks, conjugacy), we can compute closed form estimates for these quantities.

<table>
  <thead>
    <tr>
      <th><strong>Study #</strong></th>
      <th><strong>$$\sum_i X_i$$</strong></th>
      <th><strong>$$\sum_i N_i$$</strong></th>
      <th><strong>$$\hat{\theta}_{i}^{MLE}$$</strong></th>
      <th><strong>$$\hat{\theta}_{i}^{post.mean}$$</strong></th>
      <th><strong>$$\hat{\theta}_{i}^{MAP}$$</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>3</td>
      <td>8</td>
      <td>0.3750</td>
      <td>0.3751</td>
      <td>0.3333</td>
    </tr>
    <tr>
      <td>2</td>
      <td>5</td>
      <td>19</td>
      <td>0.2632</td>
      <td>0.2800</td>
      <td>0.2609</td>
    </tr>
    <tr>
      <td>3</td>
      <td>11</td>
      <td>31</td>
      <td>0.3548</td>
      <td>0.3514</td>
      <td>0.3429</td>
    </tr>
    <tr>
      <td>4</td>
      <td>20</td>
      <td>58</td>
      <td>0.3448</td>
      <td>0.3438</td>
      <td>0.3387</td>
    </tr>
    <tr>
      <td>5</td>
      <td>31</td>
      <td>96</td>
      <td>0.3229</td>
      <td>0.3235</td>
      <td>0.3200</td>
    </tr>
    <tr>
      <td>6</td>
      <td>52</td>
      <td>155</td>
      <td>0.3355</td>
      <td>0.3354</td>
      <td>0.3333</td>
    </tr>
    <tr>
      <td>7</td>
      <td>79</td>
      <td>234</td>
      <td>0.3376</td>
      <td>0.3375</td>
      <td>0.3361</td>
    </tr>
    <tr>
      <td>8</td>
      <td>102</td>
      <td>316</td>
      <td>0.3228</td>
      <td>0.3230</td>
      <td>0.3219</td>
    </tr>
    <tr>
      <td>9</td>
      <td>128</td>
      <td>436</td>
      <td>0.2936</td>
      <td>0.2941</td>
      <td>0.2932</td>
    </tr>
    <tr>
      <td>10</td>
      <td>185</td>
      <td>581</td>
      <td>0.3184</td>
      <td>0.3186</td>
      <td>0.3179</td>
    </tr>
    <tr>
      <td>11</td>
      <td>303</td>
      <td>843</td>
      <td>0.3594</td>
      <td>0.3592</td>
      <td>0.3589</td>
    </tr>
    <tr>
      <td>12</td>
      <td>425</td>
      <td>1184</td>
      <td>0.3590</td>
      <td>0.3588</td>
      <td>0.3586</td>
    </tr>
  </tbody>
</table>

As we can see, our final posterior mean and mode estimates are just a little bit less than our MLE. This is basically the effect of the prior! The prior is regularizing our estimates towards it even as we update, and the more data we observe, the less strong the prior becomes. We also started off with a relatively weak prior, so it makes sense that our posterior estimates are fairly close to the MLE. You can actually check what happens if we use a prior Beta distribution with the same mean but lower variance, using larger values of $$\alpha$$ and $$\beta$$ to increase the strength of the prior. Without a prior, our posterior mean estimates are the same as our naive estimates using the MLE. But as we increase the value of $$\alpha$$ (the `k` value on the widget, where $$\beta = 2k$$), you'll notice that the smaller the sample size (smaller dots on the plot), the more the posterior estimate is pulled toward the prior mean away from the naive estimates. Whereas the larger the sample size, the less the posterior estimates are pulled toward the prior mean. This makes sense; if we have a strong prior and not a lot of data, our beliefs haven't really updated away from what we already believed. But if we observe a lot of data, we should update towards the data even with a strong prior.

<iframe src="/assets/sar_beta_widget.html"
        width="1000"
        height="600"
        style="border:none; overflow:hidden;">
</iframe>

Now you might be wondering ... did we really need a whole other school of thought of probability to tell us that our MLEs are actually 0.0002-0.0004 higher than they should be? Well, no, but that's not actually the advantage of using Bayesian inference! The advantage brings us all the way back to quantifying uncertainty in our estimates with credible intervals.

After observing $$\sum_i X_i = 425$$ susceptible individuals out of $$\sum_i = 1184$$ contract COVID, we update our posterior distribution as $$p(\theta_i \mid X_i) \sim \text{Beta}(2 + 425, 4 + 1184 - 425) = \text{Beta}(427, 763)$$. This distribution looks something like this:

<details>
<summary><b>View Code</b></summary>
{% highlight python %}
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import beta

# Posterior parameters
alpha_post = 427
beta_post = 763

# Grid of theta values
x = np.linspace(0, 1, 1000)
y = beta.pdf(x, alpha_post, beta_post)

# Posterior mean and mode
post_mean = alpha_post / (alpha_post + beta_post)
post_mode = (alpha_post - 1) / (alpha_post + beta_post - 2)

# Plot
plt.figure(figsize=(8, 5))
plt.plot(x, y, label=r'Posterior $Beta(427, 763)$')
plt.axvline(post_mean, color='red', linestyle='--', label=f'Mean = {post_mean:.4f}')
plt.axvline(post_mode, color='green', linestyle=':', label=f'Mode = {post_mode:.4f}')
plt.scatter([post_mean], [beta.pdf(post_mean, alpha_post, beta_post)], color='red')
plt.scatter([post_mode], [beta.pdf(post_mode, alpha_post, beta_post)], color='green')
plt.xlabel(r'$\theta$')
plt.ylabel(r'$p(\theta \mid X)$')
plt.title(r'Posterior Distribution $Beta(427, 763)$')
plt.legend()
plt.tight_layout()
plt.show()
{% endhighlight %}
</details>

<img src="/assets/article_images/2025-11-19-images/beta_427_763.png" alt="Beta(427, 763) Posterior Distribution" title="Beta(427, 763) Posterior Distribution" height="500">

We now want to construct a 95% *credible interval* for our posterior estimate of $$p(\theta_i \mid X_i)$$. Since we know the exact distribution of the posterior, we can compute this interval in closed form, which is actually just the range between the 0.025 and 0.975 quantiles of this Beta distribution:

<img src="/assets/article_images/2025-11-19-images/credible_interval_95.png" alt="A 95% Credible Interval for a Beta(427, 763) Posterior Distribution" title="A 95% Credible Interval for a Beta(427, 763) Posterior Distribution" height="500">

And so, at long last, we can finally, FINALLY make a probabilistic claim on an interval we generated to estimate a parameter. A credible interval of [0.3318, 0.3863] tells us that given our model (Binomial likelihood) and our Beta(2, 4) prior, the COVID infection rate of susceptible individuals is between 0.3318 and 0.3861 with 95% posterior probability. Doesn't that feel good and easy to say? With just the MLE, we would have to make that verbose statement on confidence intervals being a procedure that has asymptotic 95% coverage of the true parameter blah blah blah blah blah.

If you're new to probability and stats and were able to follow along, I hope you learned something from this example! If you're wondering why credible intervals can't be taught in intro stats given they're so easily interpretable, I'd like to point out that (1) this toy example is probably the *easiest* case of Bayesian inference we could have done, like Chapter 1 out of Gelman's <a href="https://sites.stat.columbia.edu/gelman/book/">Bayesian Data Analysis</a> easy; (2) this example itself still basically requires you to know what a Beta distribution is, and that it's part of the Gamma family, which would mean having to teach high schoolers and freshmen what a Gamma distribution is, which is, uh, <a href="https://mathworld.wolfram.com/GammaFunction.html">probably a bad idea</a>; and (3) we could effectively ignore the integral in the denominator because of conjugacy, but not all Bayesian models are going to have conjugacy between the prior and posterior, and the only way to get around those intractable integrals is using some sort of software like <a href="https://www.pymc.io/welcome.html">PyMC</a>[^8] to generate samples of the posterior distribution using Markov Chains. And again, some of those poor kids are not even going to have learned what an integral is by the time they take intro stats, so the whole exercise seems like it's way too much to handle.

Anyway, this Bayesian inferene example has run on way too long, but it is a bonus section, so you don't really have to read it. If you did, I hope you learned something about confidence vs. credible intervals! The main takeaway of this article is supposed to just be a reminder to be careful when you talk about confidence intervals because they actually tell you a lot less than you might think, but there are other paradigms in probability which allow you to make probabilistic claims about the parameters you're estimating.

---
#### Footnotes
[^1]: <small>Feel free to work out the answer for yourself! It’s a pretty straightforward application of <a href="https://www.probabilitycourse.com/chapter1/1_4_3_bayes_rule.php">Bayes' Theorem</a> and the <a href="https://www.probabilitycourse.com/chapter1/1_4_2_total_probability.php">Law of Total Probability</a> where you can just plug and chug the numbers in the formula.</small>
[^2]: <small>This post annoyed me so much that I will write a big effortpost on why it’s wrong. Actually, I’ve had one sort of written since January but it’s really really long so I don’t know the right way to present it.</small>
[^3]: <small>Although, I would argue that more doctors should be required to take a statistics class, especially if they are in charge of medical screenings or reviewing clinical trials! You should know how to interpret the literature related to tests or medications you prescribe.</small>
[^4]: <small>I’m using the word “effect” very loosely here; you would need some other assumptions for any said effects to be causal. “Effect” here refers purely to association.</small>
[^5]: <small>The mathematical derivation is also fairly simple. Assume for fixed pooled parameter $$\theta$$, $$X_i \mid \theta \sim \text{Binomial}(N_i, \theta), i = 1, ..., 12$$. The joint likelihood of $$\theta$$ under our observed data is $$L(\theta) = \prod_{i=1}^{12} {N_i \choose X_i} \theta^{X_i} (1 - \theta)^{N_i - X_i} \implies l(\theta) = \log(L(\theta)) = \sum_{i=1}^{12} \log {N_i \choose X_i} + X_i \log(\theta) +  (N_i - X_i) \log (1 - \theta).$$ Maximizing wrt $$\theta$$ gives us $$\frac{\partial l}{\partial \theta} = \sum_{i=1}^{12} \frac{X_i}{\theta} + \frac{N_i - X_i}{1 - \theta} = 0 \implies \hat{\theta}^{MLE} = \frac{\sum_i X_i}{\sum_i N_i}$$ through some quick algebra.</small>
[^6]: <small>I'm going to have some posts coming on this soon, but in generative modeling for images, researchers have come up with very clever ways to avoid even approximating that intractable integral. GANs, for example, can be trained with purely backpropagation, avoiding the need for MCMC versus models like Boltzmann Machines, while diffusion models use score matching which avoids calculating that integral through a nifty integration-by-parts trick.</small>
[^7]: <small>Note that all plots in this blog were made with the help of ChatGPT! (I made the widgets originally in Python but used the AI to convert them to HTML.) I love writing simulation code on my own but I draw the line at doing data visualization from memory.</small>
[^8]: <small>Or Stan, if you're a real Bayesian chad, but unfortunately I do not know Stan.</small>