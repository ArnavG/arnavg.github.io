---
layout: post
title:  "The Best GTO Strategy is to Not Play GTO"
subtitle: "Beauty contests and my new favorite party game"
date:   2025-08-18 16:40:26 -0700
categories: jekyll update
---

**Table of contents:**
[The Game](#the-game) | [The Game Theory (ft. My Approach)](#the-game-theory-ft-my-approach) | [The Beauty Contest](#the-beauty-contest) | [Does the Upper Bound Matter?](#does-the-upper-bound-matter) | [So is GTO Fake?](#so-is-gto-fake) | [Addendum: A Twitter Beauty Contest](#addendum-a-twitter-beauty-contest)

This past semester, I took a class at Berkeley called <a href="https://forecastingclass.com/sp25/"> Stat 165 - Forecasting </a>. It's easily one of the most interesting classes I've ever taken, in the sense that it covers statistical reasoning in a lot of "real-world" settings.

Obviously, there are some important technical bits and pieces to pick up from the class, like forecasting calibration, mixture distributions, and strictly proper scoring rules, but the real heart of the class was our <a href="https://forecasting-leaderboard-sp25.streamlit.app/">leaderboard</a>. Every week, we'd have to submit our own 80% confidence intervals[^1] for various real-world events – everything from the number of three-pointers Luka Doncic would attempt in his Laker debut to whether the highest magnitude earthquake in the southern hemisphere would exceed the highest magnitude earthquake in the northern hemisphere in the month of March. You can think of these questions as the same Fermi estimation-style questions that you might get asked in a consulting interview with McKinsey. (I should note that I had a rather inglorious finish on the leaderboard, finishing a paltry 45th place out of 140+ students with an average score of 0.728 ... in my defense, I forgot to submit the forecasting form twice, which dropped me from around 25th place.)

In the last week of the leaderboard contest, we were asked a question that has quickly become my favorite question of the entire semester – not only because of the statistical game theory behind it, but also because I've been using it as a fun party game these last couple months.

I'll first present the question below for you to play along and pre-register your own guess. Then, I'll go over how I approached the question, what the game theory optimal (GTO) solution is, and whether the GTO solution really is GTO.

## The Game

What will be the average lower bound of the 80% confidence interval submitted for this question? Your output must be between 0 and 100 (inclusive).

The winner of the contest will be the forecaster who [^2]:
1. Produces an 80% confidence interval that contains the average lower bound.
2. Has the narrowest possible interval that still contains the average lower bound.

- Mean: ___
- Lower Bound: ___
- Upper Bound: ___

## The Game Theory (ft. My Approach)

Before I give away the game, I'll talk a little bit about how I approached the question when I encountered it for the first time in my forecasting class, having never heard of the game before and therefore not knowing how to play optimally.

I started with a very simple probabilistic assumption: this question essentially amounts to every student drawing a number uniformly at random on the interval [0, 100]. As such, we can leverage a couple of different properties of <a href="https://en.wikipedia.org/wiki/Continuous_uniform_distribution">Uniform Distributions</a>:

- The **expected value** of a $$\text{Uniform}(0, 100)$$ random variable (i.e., what we expect each draw to "average out" to in the long run) is just $$\frac{1}{2}(100 - 0) = 50$$, which should be intuitive enough. If we keep drawing random numbers between 0 and 100 and each one is equally as likely as the others to be drawn, the big numbers (like 100) and the little numbers (like 0) we draw will average out somewhere in the middle, and then all the draws from the middle numbers will really solidify the average somewhere smack-dab in the middle of the interval.
- The **standard deviation** of a $$\text{Uniform}(0, 100)$$ random variable (i.e., how far apart we expect each of our sampled draws to be from the average) is $$\sqrt{\frac{1}{12}(100 - 0)^2} = 28.87$$. If this seems high, it's because each value on our interval has an equally likely chance of being drawn, meaning that the distribution is not going to concentrate or "peak" around any one value and will remain flat over that interval if we repeatedly draw from it.

This is useful information if we were interested in forecasting the average of everyone's answer, but the question asks us to forecast the average lower bound of everyone's interval around their answer. That means we can really break this question up into 3 separate forecasting questions:

1. Generate a number uniformly at random on the interval [0, 100]. This will be your mean.
2. The upper bound must be greater than or equal to the mean you generated. So generate a second number uniformly at random on the interval [Your Mean, 100].
3. Similarly, the lower bound must be less than or equal to the mean you generated. So generate a third number uniformly at random on the interval [0, Your Mean].


We can actually calculate the expectation of the lower and upper bounds directly. Let:
- $$X ~ \text{Uniform}(0, 100)$$ be a random variable from which we draw to obtain the mean
- $$L \mid X = x ~ \text{Uniform}(0, X = x)$$ be a random variable from which we draw to obtain the lower bound
- $$U \mid X = x ~ \text{Uniform}(X = x, 100)$$ be random variable from which we draw to obtain the upper bound[^3]

Then, the expected lower bound is:

$$\mathbb{E}[L] = \mathbb{E}[\mathbb{E}[L \mid X]]$$ (law of iterated expectations)

$$= \mathbb{E}[\frac{X - 0}{2}]$$ (expectation of a uniform distribution)

$$= \mathbb{E}[\frac{X}{2}] - \mathbb{E}[\frac{0}{2}]$$ (linearity of expectation)

$$= \frac{1}{2} \mathbb{E}[X] = \frac{1}{2} \cdot (50) = 25$$ (linearity of expectation and previously calculated $$\mathbb{E}[X]$$)

Similarly, we can calculate that the expected upper bound should be 75, though it's not directly related to the forecasting question.

Okay, so we can reason that if everyone thinks of some random number between 0 and 100, and then picks another number at random to be the lower bound, that lower bound is going to average out to 25. I ran a simulation of 140 forecasters doing this exact thing and confirmed the analytical result we found above, achieving a mean lower bound of 23.60, hovering just below the expected 25:

<details>
<summary><b>View Code</b></summary>
{% highlight python %}
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

np.random.seed(165)
num_forecasters = 140
for i in range(num_forecasters):
  X = np.random.uniform(low=0, high=100, size=num_forecasters)
  L = np.random.uniform(low=0, high=X, size=num_forecasters)
  U = np.random.uniform(low=X, high=100, size=num_forecasters)

sns.histplot(data=L)
plt.axvline(np.mean(L), color='red', linestyle='--', label=f'Mean = {np.mean(L):.2f}')
plt.title("Distribution of Simulated Lower Bound Values")
plt.xlabel("Simulated Values")
plt.xlabel("Simulated Counts")
plt.legend()
{% endhighlight %}
</details>

![Distribution of Simulated Lower Bound Values](/assets/article_images/2025-08-18-images/distribution_of_simulated_lower_bound_values.png "Distribution of Simulated Lower Bound Values")

Of course, we don't just want a mean estimate of the lower bound. We want an 80% confidence interval around that estimate to quantify our level of uncertainty. Remember, the mean of 23.60 represents the mean of just one such set of 140 simulated numbers, and ideally, we'd like to simulate a couple (thousand) different sets of 140 lower bounds, get the mean each time, then find the 10th and 90th percentiles of each of those means so we have a really good idea of where the mean lower bound is going to lie around.

<details>
<summary><b>View Code</b></summary>
{% highlight python %}
# no random seed here - we want a different run each time!
lower_bound_means = np.array([])
num_bootstrap = 10_000
for n in range(num_bootstrap):
  num_forecasters = 140
  for i in range(num_forecasters):
    X = np.random.uniform(low=0, high=100, size=num_forecasters)
    L = np.random.uniform(low=0, high=X, size=num_forecasters)
    U = np.random.uniform(low=X, high=100, size=num_forecasters) # just for fun
  lower_bound_means = np.append(lower_bound_means, np.mean(L))

sns.histplot(data=lower_bound_means)
plt.axvline(np.mean(lower_bound_means), color='red', linestyle='--', label=f'Mean = {np.mean(lower_bound_means):.2f}')
plt.axvline(np.quantile(lower_bound_means, 0.1), color='red', linestyle='--', label=f'10th Percentile = {np.quantile(lower_bound_means, 0.1):.2f}')
plt.axvline(np.quantile(lower_bound_means, 0.9), color='red', linestyle='--', label=f'90th Percentile = {np.quantile(lower_bound_means, 0.9):.2f}')
plt.title("Distribution of Bootstrapped Mean Lower Bound Values")
plt.xlabel("Simulated Values")
plt.xlabel("Simulated Counts")
plt.legend()
{% endhighlight %}
</details>

![Distribution of Bootstrapped Mean Lower Bound Values](/assets/article_images/2025-08-18-images/distribution_of_bootstrapped_mean_lower_bound_values.png "Distribution of Bootstrapped Mean Lower Bound Values")

A special shoutout to the <a href="https://en.wikipedia.org/wiki/Central_limit_theorem">Central Limit Theorem</a>!

And like that, we're done! We not only know that the average lower bound is going to be around 25, but we also believe that there's an 80% chance the lower bound is going to fall between 22.61 and 27.43, confirmed through 10,000 simulated lower bounds!

I go to the Google Form and start filling in my estimates...
- Mean: 25
- Lower Bound: 22.61
- Upper Bound: 27.43

...when suddenly something occurs to me.

*I'm not drawing numbers uniformly at random for my own, personal lower bound estimate.*

In fact, all the numbers I've submitted are completely incongruent with the theory I started with. I'm not drawing a number uniformly at random for my mean. Remember, one of the win conditions of the game is that your interval has to contain the average of everyone else's lower bound guess. If everyone else played the game by drawing numbers uniformly at random, and I was the only enlightened individual who thought of using bootstrap simulation, then sure, my strategy is sound.

But come on, this is a Berkeley stats class, and I suspect a lot of people are following my strategy of calculation expectations of random variables and running bootstrap simulations. What if they've also thought to this step – their mean is 25, lower bound ≥22, upper bound ≤28?

I've discovered I have a new incentive to "cheat" – if everyone submits a lower bound of around 22, then I can actually outscore them by decreasing my lower bound to something like 21, and setting my upper bound at something like 25. Now I've caught the people thinking even two steps ahead.

Except ... what if people are also thinking two steps ahead? Should I think three steps ahead? What if I set my lower bound to 20 and upper bound to something like 23 or 25? But what if they thought of that too?

And suddenly, I realized something. (I should have maybe realized it much earlier, sure, but at least I realized it eventually.) The optimal strategy is to set my lower bound as low as possible.

In fact, everyone has an incentive to do this. If we all set our lower bounds to 0, we're all "guaranteed" a win, in a sense – in fact, it's the <a href="https://en.wikipedia.org/wiki/Nash_equilibrium">Nash equilibrium</a> of this game. It guarantees that the average lower bound will be 0, and since the problem is on a bounded interval, no one can "cheat" their score downward to gain an edge past that point.

If this were a two-person game, the maximum possible average lower bound if you set yours to 0 is 50, if your opponent chooses 100. Realizing that the maximum possible average is 50, your opponent should revise their lower bound downward, maybe to 49, before they realize that the new average lower bound is now 24.5, meaning they should keep revising their lower bound downward until they hit 0.

## The Beauty Contest

The more well-read of you might recognize this game as a variant of the <a href="https://en.wikipedia.org/wiki/Keynesian_beauty_contest"> *Keynesian Beauty Contest*</a>. In one chapter of <a href="https://en.wikipedia.org/wiki/The_General_Theory_of_Employment,_Interest_and_Money">*The General Theory*</a>, the economist John Maynard Keynes described a newspaper contest where readers are asked to pick the six most beautiful faces from a hundred photographs. The prize goes to whoever picks the faces that most closely match the average selection of all contestants.

So what happens? Much like our forecasting game where you're not picking based on your own randomly generated numbers, people don't pick their favorite faces for the newspaper beauty contest. Instead – much like I tried to do – they try to pick what *they think other people will pick*. But of course, everyone else is doing the same thing. So you have to pick what you think others will think others will pick. And so on. As Keynes wrote, it's not a matter of choosing what you find beautiful, but:

> "what average opinion expects the average opinion to be."

So you end up going down this inductive spiral, where your optimal strategy is shaped by second-order, third-order, fourth-order, ..., beliefs.

You'll often see a "stylized" version of the Keynesian Beauty Contest that makes this more concrete. Suppose you're playing a game where each player has to guess an integer between 1 and 100, and the player who names the integer closest to two-thirds of the average integer wins the game. If you believe the average guess will be $$X$$, your optimal strategy is to guess $$\frac{2}{3}X$$. Since 100 is the maximum guess, your optimal guess should be no greater than 67. But if 67 is the optimal guess, then your optimal guess should be no greater than $$\frac{2}{3}(67)$$. And if $$\frac{2}{3}(67)$$ is the optimal guess, then your optimal guess should be no greater than $$(\frac{2}{3})(\frac{2}{3})(67)$$. Eventually, the optimal guess will converge to the lower bound of the acceptable range of guesses, which in this case is 1.

## Does the Upper Bound Matter?

I remember texting my classmate Tiffany after I discovered the GTO solution was 0, just as a sanity check to see if everyone else was able to arrive at the same solution as me.

Turns out not only did she discover the GTO solution was 0, but so did the rest of the class, and someone decided to go ahead and post on our class Ed forum to ask everyone to collude and set our lower bound answer to 0 (he even got an endorsement from course staff!).

![Ed Forum Post Encouraging Collusion](/assets/article_images/2025-08-18-images/ed_post.png "Ed Forum Post Encouraging Collusion")

So in the end, a significant portion of the class figured out that the optimal answer was 0, meaning there was not really any reason for me to list anything else.

But recall the *second* win condition – whoever has the **narrowest interval** that also contains the average lower bound is the winner of the contest.

The width of your interval is generally supposed to reflect your own subjective degree of certainty in whether or not the eventual answer will be captured by the interval. If I set my upper bound at 1, I'm basically signalling that I'm 80% confident that the average lower bound is going to be essentially 0, or, thought of slightly differently, that basically everyone in the class is going to figure out the optimal strategy and play accordingly.

Of course, to set an upper bound of 1 would also be silly, because it seems pretty obvious that not everyone in the class is going to figure out how to play optimally. But that still raises an interesting point – our upper bound should be set to reflect our own subjective belief of how many people know how to play the game.

I'm sure you can set up a very interesting Bayesian modeling problem where you have some Beta-distributed prior $$\theta$$ that reflects your belief on the share of people who know how to play the game, then estimate $$\theta$$ by going around and asking a handful of your classmates what their lower bound is and updating your posterior accordingly. That's what Tiffany did, and she ended up scoring a 0.88 on this question (out of 1).

I did something far less elegant. I know there's around 140 forecasters who regularly submit their homework in this class, and rather than explicitly model what share of them I think know how to play the game as a random variable, I just brute-forced my way through a crude sensitivity analysis by simulating what the average lower bound would be if p% of people (from 0 to 1 in 0.05 intervals) knew how to play.

<details>
<summary><b>View Code</b></summary>
{% highlight python %}
num_forecasters = 140
num_bootstrap = 10_000
those_who_know = np.arange(0, 1.05, 0.05)  # include 1.0
lower_bound_means_by_p = {p: [] for p in those_who_know}

for p in those_who_know:
 for n in range(num_bootstrap):
   num_know = int(p * num_forecasters)
   num_dont_know = num_forecasters - num_know

   # Those who don't know
   X_unknown = np.random.uniform(low=0, high=100, size=num_dont_know)
   L_unknown = np.random.uniform(low=0, high=X_unknown)

   # Those who know
   L_known = np.zeros(num_know)

   # Combine
   L_total = np.concatenate([L_unknown, L_known])
   mean_L = np.mean(L_total)
   lower_bound_means_by_p[p].append(mean_L)
means = [np.mean(lower_bound_means_by_p[p]) for p in those_who_know]
p10 = [np.percentile(lower_bound_means_by_p[p], 10) for p in those_who_know]
p90 = [np.percentile(lower_bound_means_by_p[p], 90) for p in those_who_know]

plt.fill_between(those_who_know, p10, p90, alpha=0.3, label="80% Credible Interval")
plt.plot(those_who_know, means, marker='o', label="Mean Lower Bound")
plt.xlabel("Proportion of Class Who Know the Optimal Strategy")
plt.ylabel("Expected Average Lower Bound")
plt.title("Expected Average Lower Bound \nby Proportion of Class Who Know the Optimal Strategy")
plt.legend()
plt.grid(True)
plt.show()
{% endhighlight %}
</details>

![Expected Average Lower Bound by Proportion of Class Who Know the Optimal Strategy (140 Forecasters)](/assets/article_images/2025-08-18-images/expected_avg_lower_bound_140.png "Expected Average Lower Bound by Proportion of Class Who Know the Optimal Strategy (140 Forecasters)")

One thing about me is that I'm an extremely conservative forecaster – mostly because I was already behind in our class competition, and I was a lot more concerned with my estimate falling within the interval than trying to game my way into the narrowest interval. That being said, I ended up picking [0, 25] as my lower bound and upper bound, which in hindsight is really stupid and way too conservative. I already knew that at minimum, 40 out of 140 had seen the collusion post on Ed based on the number of views it had when I saw it, so even picking something like 17 or 20 would have been a better guess. Hindsight is always 20-20, of course, and I guess some part of me thought that us colluders were some special, enlightened bunch, a small elite of the class who knew how to play GTO.

The average lower bound was 7. From my simulation, that means probably around 70% of the class figured out the optimal strategy. I scored a 0.87. We were not, in fact, a special, enlightened bunch.

## So is GTO Fake?

I think my main takeaway from this game is that coming up with a winning lower bound and upper bound is not even necessarily about whether you know how to play GTO or not. Coming up with a winning interval essentially boils down to your own subjective guess on how many people playing the game will figure it out (which I think surprisingly applies to a lot of classical game theory settings as well!).

As a quick aside, I think a lot more people can easily figure out what the optimal strategy is if you present them with an "unbounded" version of the game. Rather than come up with a lower and upper bound on the interval [0, 100] to try and get the lowest average, come up with a lower and upper bound on the interval ($$-\inf$$, $$\inf$$) instead. I have a feeling that people can intuitively recognize that they should try to make their lower bound estimate as low (read: large and negative) as possible to drag the average lower bound down (and in fact, the optimal strategy would be to set your lower bound to $$-\inf$$).

But I don't think it's as intuitive on the interval [0, 100] for whatever reason, even though the same logic still applies.

To test this out, I enlisted the help of my friend Mayank, who got members of our statistics club to submit their forecasts for this game at our end of year banquet presentations.

Of the 44 submissions, only 9 people set 0 as their lower bound, but it's not even clear that these people knew how to actually play the game; 5 of them had intervals of [0, 100].

However, many people (including myself) hedged at least a little on people not knowing the optimal strategy and had non-zero lower bounds. I personally set mine at 3 (spoiler: I went from having too little faith in my peers to too much this game). Ultimately, 31 people (70% of forecasters) had their lower bounds set at 25 or less (and an additional 3 people had lower bounds of 26), and the average lower bound ended up being 20.57, with the winning interval being [20, 22].

But I don't think that means that these people were strategically setting their lower bound higher to account for the fraction of people who didn't know how to play the game optimally; in fact, I think most of these very same people didn't know how to play the game optimally. I noticed the majority of forecasting intervals (28 out of 44 or 64%) had upper bounds at or below 50 (30 out of 44 if you count the two forecasters who had upper bounds of 51 and 52), meaning their forecasting strategy likely resembles the "uniform random guessing" strategy I used in my simulation. They just picked a lower bound kind of in the middle between 0 and the midpoint of the forecasting interval.

While my interval of [3, 27] was enough to contain the final resolved average lower bound, I actually think I would have been in a lot better shape if I used my initial modeling approach, maybe thinking one step ahead and setting [21, 25] as my interval like I was going to on my class assignment (I still wouldn't have won, but I would have scored better). Tiffany completely forwent any sort of Nash equilibrium as she (correctly) surmised that no one in the room would know what the true GTO solution was, and her interval was [18, 25].

Post-banquet, I re-ran my expected lower bounds simulation, this time with 44 forecasters, and got directionally similar albeit noisier results to the 140 forecaster simulation. Probably around 20% of forecasters, if not fewer, knew how to play the game optimally, which comes out to around 9 out of the 44 players. From my own subjective count of which intervals looked feasibly "optimal," at most 15 of the 44 forecasters (34%) used some sort of strategy of setting a reasonably low lower bound to account for the Nash equilibrium, and then set a moderately higher upper bound, usually less than 30, to account for whatever fraction of people they expected to not know how to play GTO.

![Expected Average Lower Bound by Proportion of Class Who Know the Optimal Strategy (44 Forecasters)](/assets/article_images/2025-08-18-images/expected_avg_lower_bound_44.png "Expected Average Lower Bound by Proportion of Class Who Know the Optimal Strategy (44 Forecasters)")

As one final test for this game, I decided to try it out during an evening of Top Golf with my friends. I knew there would be 7 of us going, so I pre-ran my simulation to see what the 80% credible intervals looked like for just 7 forecasters. I expected them to be wide to account for the amount of variance with so few of us submitting guesses, but I thought it would be a reasonable starting point.

![Expected Average Lower Bound by Proportion of Class Who Know the Optimal Strategy (7 Forecasters)](/assets/article_images/2025-08-18-images/expected_avg_lower_bound_7.png "Expected Average Lower Bound by Proportion of Class Who Know the Optimal Strategy (7 Forecasters)")

Now, I was tempted to go ahead and play GTO, but that would actually be a pretty terrible strategy unless I expected 4 or 5 of my friends to also figure out the optimal strategy. (Then I could get away with setting a bound of [0, 5] or [0, 7] or [0, 10] or [0, 15] worst case scenario, depending on what I thought the last one or two friends would set as their lower bound.)

But realistically, I only expected 1 to 2 of my friends to figure out the Nash equilibrium, and they both probably had the same thought process as me on whether to set it at exactly 0 or hedge their lower bound up.

Ultimately, the lower bound average ended up being 27, and 2 of my friends did figure out the strategy of setting as low a lower bound as possible while playing. One set their interval to [5, 20], which unfortunately did not contain the resolved average lower bound, while my other friend and I both set our intervals to [15, 30] and tied for the win.

Anecdotally, a rule of thumb I've discovered is that [20, 30] seems to be a pretty reliable winning interval when playing this game with friends.

Now, to bring it back to this section's heading: is GTO fake? Well, not really, in the sense that GTO solutions to games do exist. But whether to play GTO also depends on knowing who your opponents are. In a class of upper-division statistics majors who have all day to sit and think about the problem and access the Internet to cheat through the solution, then yes, by all means, play GTO and set that lower bound to 0. But in a casual party setting where most people are probably annoyed with you for even suggesting to play this game? Feel free to put down your dick-measuring stick, submit [15, 30], and call it a day. In a forecasting game, a winning solution is not the one that is necessarily theoretically optimal; it's the one that – and forgive me for defaulting to cliche – accounts for the fallibility of human behavior and does not implicitly bake the assumption that humans are rational actors into a winning solution.[^4]

## Addendum: A Twitter Beauty Contest

Funnily enough, as I was writing this article, a variant of the Beauty Contest game went kind of viral on Twitter:

![Twitter Beauty Contest Variant by @pli_cachete](/assets/article_images/2025-08-18-images/rota_poll_initial.jpeg "Twitter Beauty Contest Variant by @pli_cachete")

If you've been paying attention to the article, you should recognize that the Nash equilibrium is to select option D. If every voter votes option D, then 100% of votes will go to that option, and everybody wins, so you as the player do not have an incentive to select a different option since there is nothing to gain if everyone else sticks with option D. Yay!

Obviously, the results were anything but GTO.

![Twitter Beauty Contest Poll Results by @pli_cachete](/assets/article_images/2025-08-18-images/rota_poll_results.png "Twitter Beauty Contest Poll Results by @pli_cachete")

Now, I voted D, because I will never disrespect the legacy of John Nash, but the results of the poll were not really surprising to me given I'd had experience playing Beauty Contest games before. I also thought that it was really funny when ryxcommar ran the same poll a day later, disgruntled by the results of this one, and wound up with essentially identical results:

![Twitter Beauty Contest Poll Results by @ryxcommar](/assets/article_images/2025-08-18-images/ryxcommar_poll_results.png "Twitter Beauty Contest Poll Results by @ryxcommar")

Swaths of Econ and Stat Twitter were very upset by the results of these polls, incredulous of the ignorance of the masses to identify the Nash equilibrium. But I think the irony here is that playing GTO essentially gets you nowhere in this particular game, and the term is almost nonsensical in the sense that it can't be an "optimal" strategy if it also doesn't win you the game in practice. So maybe the actual GTO chads are the ones who voted B after all! Nash-cels stay losing, I guess.

---

#### Footnotes
[^1]: <small>Technically, what we were submitting are more accurately described as **Bayesian credible intervals**, since our bounds are supposed to reflect our own subjective degree of uncertainty in the probability of certain events happening and should contain our point forecasts with 80% probability (in the subjective sense).</small>
[^2]: <small>This is actually an oversimplification of how to "win" the contest, which is actually determined by a forecasting "score" produced by a strictly proper scoring rule. However, this explanation is much more intuitive to people playing the game for the first time and is usually good enough to determine the winner.</small>
[^3]: <small>Note that while the conditional distributions are Uniform, the **marginal** distributions of L and U are actually triangular-shaped right and left skewed (mixture) distributions respectively, each with some log density.</small>
[^4]: <small>I wanted to quickly comment that I think this is a generally overrated sentiment that's nonetheless mostly true for playing the Beauty Contest game as a party game. But I think it's also not a great criticism of economic models in general because (1) people overestimate the degree to which "irrational behavior" impacts the predictions of these models; (2) "irrational" is not a synonym for "unpredictable;" in fact, as my simulations show, we can probabilistically account for the ways people may act irrationally and adjust our predictions accordingly; and (3) "irrationality" generally seems like an unnecessarily pejorative way to refer to human decision-making; people generally are not acting irrationally (at least intentionally) even if their decisions are not necessarily Nash equilibria, and my sense is that most people make what they perceive to be the best possible decisions/act in their best interests given what they know and what constraints they're subject to.</small>