---
layout: post
title:  "Notes with Nav: A Causal Inference Primer (Training Camp)"
subtitle: "Potential Outcomes, Randomization, DAGs"
date:   2026-06-04 00:00:00 -0500
categories: jekyll update
---

**Table of contents:**
[Prelude: Is Causality Real? Who Knows](#prelude-is-causality-real-who-knows) | [Causality, Counterfactuals, Potential Outcomes, and SUTVA](#causality-counterfactuals-potential-outcomes-and-sutva) | [F*ck It, We Randomize](#fck-it-we-randomize) | [DAG Nabbit! Associations vs. Interventions](#dag-nabbit-associations-vs-interventions) | [A Code Example: LaLonde (1986)](#a-code-example-lalonde-19861)

Welcome to the first edition of Notes with Nav: June Training Camp edition! The goal for this month is to compile a list of helpful notes spanning causal inference, regression, and ML fairness, perhaps with some case studies, paper readings, and code demos sprinkled in between.

For this first note, I wanted to kick things off with a very basic intro to causal inference, RCTs, and causal diagrams. Note that this won't be in a textbook-style prose format, so these notes aren't going to be super duper technically rigorous; if you're looking for something like that, I'll link all my causal inference resources below. These are mostly meant to be rough notes that I will refer to for quick facts or proofs in the future.

## Prelude: Is Causality Real? Who Knows

"What is causality" is a difficult question to answer, because philosophically, a notion of causality may not be directly observable. <a href="https://iep.utm.edu/hume-causation/">Hume</a>, for example, argued that we can never really observe causation, and that our idea of causation stems from repeatedly observing one event follow another event. If one billiard ball hits another billiard ball, for example, we can observe that the second billiard ball changes direction after it is touched by the first billiard ball, but we cannot observe the "causal force," so to speak, that drives this interaction. Hume did not have the last word on causality; Kant, for example, <a href="https://plato.stanford.edu/entries/kant-hume-causality/#KantAnswHume">attempted to respond</a> to Hume on causality by arguing that causality is supplied by the mind as a basic *a priori* category through which we organize experience.

I am going to largely ignore these debates since (1) we can define causality in a structured way that skirts some of these metaphysical problems, (2) these problems matter little to the downstream procedures, and (3) I am not qualified to comment on these problems since I have a very shallow background in philosophy.

## Causality, Counterfactuals, Potential Outcomes, and SUTVA

A famed adage in statistics is that "correlation does not necessarily imply causation." The idea here is that we can observe spurious associations between different variables that may have a common cause, or are subject to some sort of selection bias that distorts their true causal relationship. (More on that later.)

In 1950, for example, Doll and Hill <a href="https://csts.ua.edu/files/2019/01/1950-09-30-BMJ-Smoking-Carcinoma-of-the-Lung-Doll-Hill.pdf">published a report</a> finding an association between smoking and lung cancer incidence, where 0.3% of lung cancer patients were non-smokers, compared to 4.2% of non-lung cancer patients being non-smokers, a risk ratio of 14. Even after controlling for various factors, the risk ratio remained as high as 9. The statistician Ronald Fisher (a heavy smoker himself) would later argue that there is a common latent genetic factor that influences both propensity to develop lung cancer and cigarette smoking, but there is no true causal relationship between the two.

By now, there's a scientific consensus that <a href="https://ourworldindata.org/data-insights/lung-cancer-deaths-trace-the-rise-and-fall-of-smoking">smoking does cause lung cancer</a> (and a <a href="https://ourworldindata.org/smoking">host of other health problems</a>), but it required evidence much beyond simple observed associations to be certain of this causal link. There are plenty of spurious associations that, if interpreted as causal, would lead to nonsensical conclusions. The association between ice cream sales and drowning is a famous textbook example; the observed association is not because ice cream causes individuals to drown, but because both swimming and eating ice cream are done when temperatures are high in summer months.

<div style="text-align: center; padding: 25px">
<img src="/assets/article_images/2026-06-04-images/ice_cream_smoking_associations.png" alt="Associations between Ice Cream and Drowning and Smoking and Lung Cancer" title="Associations between Ice Cream and Drowning and Smoking and Lung Cancer" width="700">
</div>
<small><i>Correlation does not necessarily imply causation (Panel A), but sometimes correlations can point toward actual causal relationships (Panel B). Image taken from Ch. 36 of Probabilistic Machine Learning (Murphy, Veitch, D'Amour).</i></small>

This does raise the question though of what "causation" actually is, because it seems very difficult to disentangle from correlation if some common factor we haven't accounted for can plausibly overturn the observed association.

Enter the **potential outcomes** model, which takes a very simple view of what causality is; a "causal effect" is simply the difference between your realized outcome after undergoing an intervention, and your realized outcome had you *not* undergone that intervention (the **counterfactual**). For example, we could ascertain the effect of smoking on lung cancer on individual $$i$$ by figuring out whether they would have developed lung cancer had they not smoked. Formally, we denote potential outcomes as follows:

Suppose we have $$n$$ treatment units $$i = 1, ..., n$$ and an outcome of interest $$Y$$. Each unit has two potential outcomes for $$Y$$:

- the outcome under a hypothetical intervention $$1$$: $$Y_i(1)$$
- the outcome under a hypothetical intervention $$0$$: $$Y_i(0)$$

Typically, $$Y_i(1)$$ will correspond to the potential outcome under treatment, while $$Y_i(0)$$ corresponds to the potential outcome of the control.

For each treatment unit $$i$$, we can gather their potential outcomes in an $$n \times 2$$ *science table* as follows:

| Unit $$i$$ | Potential outcome under treatment | Potential outcome under control |
|---:|---:|---:|
| 1 | $$Y_1(1)$$ | $$Y_1(0)$$ |
| 2 | $$Y_2(1)$$ | $$Y_2(0)$$ |
| $$\vdots$$ | $$\vdots$$ | $$\vdots$$ |
| $$n$$ | $$Y_n(1)$$ | $$Y_n(0)$$ |

And from here, we can very easily define the causal effect for unit $$i$$ as the difference between what would happen to unit $$i$$ under treatment and what would happen to that same unit under control:

$$
\tau_i = Y_i(1) - Y_i(0), (i = 1, ..., n)
$$

Sadly, causal inference is not that simple.

The problem, of course, is that we can never observe both potential outcomes for the same unit. If individual $$i$$ receives treatment, we observe $$Y_i(1)$$ but not $$Y_i(0)$$. If individual $$i$$ does not receive treatment, we observe $$Y_i(0)$$ but not $$Y_i(1)$$. This is often called the **fundamental problem of causal inference**: for each unit, one potential outcome is observed, while the other is counterfactual. At most, we can only observe half the science table, meaning we cannot actually calculate $$\tau_i$$ from our observed data; at best, we can infer it from methods we will develop below.

Let $$Z_i \in \{0,1\}$$ denote the treatment assignment for unit $$i$$, where $$Z_i = 1$$ means the unit receives treatment and $$Z_i = 0$$ means the unit receives control. The observed outcome is:

$$
Y_i^{obs} = Z_iY_i(1) + (1-Z_i)Y_i(0)
$$

So if $$Z_i = 1$$, then $$Y_i^{obs} = Y_i(1)$$, and if $$Z_i = 0$$, then $$Y_i^{obs} = Y_i(0)$$.

Another problem is that defining what constitutes a valid "intervention" is not something that happens for free. This setup relies on an important assumption called the **Stable Unit Treatment Value Assumption,** or **SUTVA**. Under SUTVA:

1. **No interference between units:** one unit's treatment assignment does not affect another unit's outcome.
2. **No hidden versions of treatment:** the treatment is well-defined, so $$Y_i(1)$$ and $$Y_i(0)$$ mean the same thing for every unit.

The first condition means that unit $$i$$'s potential outcomes depend only on whether unit $$i$$ receives treatment, not on whether other units receive treatment. Formally, we write potential outcomes as $$Y_i(1)$$ and $$Y_i(0)$$, rather than something more complicated like:

$$
Y_i(Z_1, Z_2, ..., Z_n)
$$

It's easy to imagine examples where the non-interference assumption is violated, particularly in networks. For example, suppose we are studying the effect of a vaccine on infection risk. If my vaccination status affects your infection risk, then there is interference between units, and SUTVA is violated. Your potential outcome would depend not only on whether you were vaccinated, but also on whether people around you were vaccinated. These are sometimes called **spillovers** in the literature. Another example of network interference is in two-sided rideshare markets, where giving cash incentives on the demand side (riders) also affects driver supply, which in turn affects the potential outcomes of riders who did not receive cash incentives (hint, hint, nudge, nudge, alluding to a future training camp article).

The second condition means that there are not multiple relevant versions of the treatment hidden inside the label "treated." For example, if $$Z_i = 1$$ means "received tutoring," SUTVA requires that the treatment be defined clearly enough that all treated students are receiving the same kind of intervention. If some students receive one-on-one tutoring from an expert teacher, while others receive a short prerecorded video, then $$Y_i(1)$$ is ambiguous and doesn't have the same stable interpretation across units.

So, under SUTVA, each unit has exactly two well-defined potential outcomes, $$Y_i(1)$$ and $$Y_i(0)$$, and these potential outcomes are not affected by the treatment assignments of other units.

## F*ck It, We Randomize

It's basically impossible to make inferences at the individual level about treatment effects $$\tau_i$$ since we can only observe one potential outcome. But is it possible to make inferences about treatment effects *on average*?

Let's start with our observed values $$Y_i^{obs} = Z_iY_i(1) + (1-Z_i)Y_i(0)$$. Recall that $$Z_i$$ denotes assignment to either treatment group $$1$$ or $$0$$ and $$Y_i(\cdot)$$ denotes the corresponding potential outcome. If we put all our $$n$$ observed values in a random vector as so...

$$
Y^{obs} =
\begin{pmatrix}
Y_1^{obs} \\
Y_2^{obs} \\
\vdots \\
Y_n^{obs}
\end{pmatrix}
\in \mathbb{R}^n
$$

...we can, in principle, average over all the observed outcomes where the treatment assignment is $$Z_i = 1$$, then average over all the observed outcomes where the treatment assignment is $$Z_i = 0$$, and finally subtract the two to obtain some notion of an estimated "treatment effect" $$\hat{\tau}$$.

$$
\hat{\tau}
=
\frac{1}{n_1}\sum_{i=1}^n Z_iY_i^{obs}
-
\frac{1}{n_0}\sum_{i=1}^n (1-Z_i)Y_i^{obs}
$$

where

$$
n_1 = \sum_{i=1}^n Z_i,
\qquad
n_0 = \sum_{i=1}^n (1-Z_i)
$$

denote the number of units in the treatment and control arm respectively. Equivalently, we can write this as:

$$
\hat{\tau}
=
\frac{1}{n_1}\sum_{i:Z_i=1} Y_i^{obs}
-
\frac{1}{n_0}\sum_{i:Z_i=0} Y_i^{obs}.
$$

This quantity, in general, does NOT identify the "true" average causal effect, because the assignment mechanism may induce bias in our observed outcomes. For example, suppose $$Y_i \in \{0,1\}$$ denoted whether someone drowned, and $$Z_i\in \{0,1\}$$ denoted whether they ate ice cream on that same day. By simply subtracting the rate of drowning among ice cream eaters from the rate of drowning among non-ice cream eaters, we are ignoring the selection mechanism (hot summer weather, perhaps) that generates our observed distribution of outcomes. In other words, the treatment assignment mechanism is not independent of the potential outcomes.

Luckily, **randomization** exists to make treatment assignment independent of the potential outcomes. More precisely, if $$Z = (Z_1, ..., Z_n)$$ denotes the full treatment assignment vector, then under randomization, the assignment mechanism is independent of the science table:

$$
Z \perp \{Y_i(1), Y_i(0)\}_{i=1}^n.
$$

To understand why, suppose I am vaccinating a bunch of people for COVID-19, and as the patients come one-by-one, I'm tempted to give the older, sicker looking patients the actual vaccine rather than the placebo, because I don't want the guilt to weigh on me if an elderly patient contracts COVID-19 and I injected them with saline solution. In this case, the potential outcomes (contracting vs. not contracting COVID-19 post-vaccination) of elderly patients are NOT independent of the assignment mechanism, and if I subtracted the average outcome of unvaccinated patients from the average outcome of vaccinated patients, I would likely be *underestimating* the effect because the vaccinated group is systematically older and sicker regardless of vaccination status. But, if I flipped a coin instead to determine whether or not to vaccinate a patient, independent of any external factors, then the treatment assignment mechanism becomes independent of their potential outcomes; my decision to vaccinate them is now randomly assigned and therefore independent of whether or not I think those patients are likely to contract COVID-19.

I've belabored the point enough but it becomes really easy to see why this is useful through a couple of mathematical steps. First, substituting $$Y_i^{obs} = Z_iY_i(1) + (1-Z_i)Y_i(0)$$ into our estimator gives:

$$
\hat{\tau}
=
\frac{1}{n_1}\sum_{i=1}^n Z_i\left[Z_iY_i(1) + (1-Z_i)Y_i(0)\right]
-
\frac{1}{n_0}\sum_{i=1}^n (1-Z_i)\left[Z_iY_i(1) + (1-Z_i)Y_i(0)\right]
$$

Since $$Z_i \in \{0,1\}$$, this simplifies to:

$$
\hat{\tau}
=
\frac{1}{n_1}\sum_{i=1}^n Z_iY_i(1)
-
\frac{1}{n_0}\sum_{i=1}^n (1-Z_i)Y_i(0)
$$

Now we can define the finite-sample average treatment effect:

$$
\tau
=
\frac{1}{n}\sum_{i=1}^n \left(Y_i(1)-Y_i(0)\right)
=
\bar{Y}(1)-\bar{Y}(0),
$$

where

$$
\bar{Y}(1) = \frac{1}{n}\sum_{i=1}^n Y_i(1),
\qquad
\bar{Y}(0) = \frac{1}{n}\sum_{i=1}^n Y_i(0)
$$

Taking the expectation over the random treatment assignment mechanism:

$$
\mathbb{E}_Z[\hat{\tau}]
=
\mathbb{E}_Z\left[
\frac{1}{n_1}\sum_{i=1}^n Z_iY_i(1)
-
\frac{1}{n_0}\sum_{i=1}^n (1-Z_i)Y_i(0)
\right]
$$

By linearity of expectation:

$$
\mathbb{E}_Z[\hat{\tau}]
=
\frac{1}{n_1}\sum_{i=1}^n \mathbb{E}_Z[Z_i]Y_i(1)
-
\frac{1}{n_0}\sum_{i=1}^n \mathbb{E}_Z[1-Z_i]Y_i(0)
$$

Under complete randomization, where exactly $$n_1$$ of the $$n$$ units are assigned to treatment,

$$
\mathbb{E}_Z[Z_i] = \frac{n_1}{n},
\qquad
\mathbb{E}_Z[1-Z_i] = \frac{n_0}{n}
$$

Therefore:

$$
\mathbb{E}_Z[\hat{\tau}]
=
\frac{1}{n_1}\sum_{i=1}^n \frac{n_1}{n}Y_i(1)
-
\frac{1}{n_0}\sum_{i=1}^n \frac{n_0}{n}Y_i(0)
$$

Simplifying:

$$
\mathbb{E}_Z[\hat{\tau}]
=
\frac{1}{n}\sum_{i=1}^n Y_i(1)
-
\frac{1}{n}\sum_{i=1}^n Y_i(0)
=
\bar{Y}(1)-\bar{Y}(0)
=
\tau
$$

This means that under random treatment assignment, we can simply average over the outcomes in each treatment arm and subtract them. Formally, if our **estimand** is the finite-sample average treatment effect, we are able to **identify** it under randomization through the $$\hat{\tau}$$ **estimator**.

$$
\mathbb{E}_Z[\hat{\tau}] = \tau = \bar{Y}(1) - \bar{Y}(0)
$$

According to Fisher, randomization has two primary benefits:
1. On average, the treatment and control groups will be directly comparable; in other words, you get an "all else equal" comparison needed to reason about causality. The difference-in-means estimator has the additional benefit of being unbiased for the ATE under randomization.
2. Randomization directly justifies the Fisher Randomization Test (FRT) for statistical inference. Under the sharp null hypothesis that the potential outcomes would have been the same for every unit regardless of treatment ($$Y_i(1)=Y_i(0)$$), the missing potential outcomes are known from the observed outcomes, so we can repeatedly permute the treatment assignment vector $$Z$$ and compare our observed test statistic to its randomization distribution. In practice, enumerating all possible assignments is often infeasible when $$n$$ and $$n_1$$ are large, so we approximate this distribution by Monte Carlo simulation; the test statistic can be the difference in means, a rank-based statistic like Wilcoxon for a nonparametric test, or a Kolmogorov-Smirnov statistic if we want to compare the full empirical outcome distributions.

## DAG Nabbit! Associations vs. Interventions

<div style="text-align: center; padding: 10px">
<img src="/assets/article_images/2026-06-04-images/dagnabbit-yosemite-sam.png" alt="DAG Nabbit! - Yosemite Sam" title="DAG Nabbit! - Yosemite Sam" width="700">
</div>

So far, I've talked about how correlation does not imply causation. Another way to view this same point is that observed associations do not necessarily imply effective interventions.

What do I mean by this? Let's take a look at <a href="https://injuryfacts.nsc.org/motor-vehicle/overview/age-of-driver/">driver fatal crash statistics</a> by age group:

<div style="text-align: center; padding: 20px">
<img src="/assets/article_images/2026-06-04-images/driver_crashes_by_age.png" alt="Driver Crash Fatalities by Age Group" title="Driver Crash Fatalities by Age Group" width="700">
</div>

Here, we observe that drivers aged 16-19 were 18% more likely to be involved in a fatal car accident than drivers aged 20-24. Additionally, 16-year-old drivers had the highest per-capita rate of fatal crashes, with the fatal crash rate decreasing after the age of 19.

A policymaker might observe this association between age and fatal crash rates and propose raising the legal driving age from 16 to 20. Doing so, he argues, would help decrease fatal crashes by removing the most accident-prone age demographic from the driving pool.

But would this *actually* decrease the fatal crash rate? It depends on the data generating process. We can propose the following **structural causal model (SCM)** via a directed acyclic graph (DAG):

$$
A \rightarrow E \rightarrow Y
$$

where:

- $$A$$ denotes age
- $$E$$ denotes driving experience
- $$Y$$ denotes fatal crash risk

Here, age affects how much driving experience someone has, and driving experience affects their probability of being involved in a fatal crash. This is a plausible story because 16-year-old drivers are both young *and* inexperienced. The observed association between age and fatal crash risk might therefore be driven less by age itself and more by the fact that the youngest legal drivers are also the least experienced drivers. We say that the effect of age on crash fatality is *mediated* by experience in this SCM.

The implication is that the observed association does not necessarily imply that *intervening* will produce the same crash-risk profile we observe among today’s older drivers. In other words, observing that 16-year-old drivers have higher fatal crash rates than 20-year-old drivers does not automatically imply that making everyone wait until age 20 to drive will make those new 20-year-old drivers behave like the current group of 20-year-old drivers. The current group of 20-year-old drivers includes many people who have already accumulated several years of driving experience, but if we raise the driving age from 16 to 20, then we may simply reallocate inexperience to age 20. The new group of 20-year-old first-time drivers may look less like today's experienced 20-year-old drivers and more like today's inexperienced 16-year-old drivers.

Thus, the association between age and fatal crash risk does not necessarily help us answer the relevant causal question of intervention: "what would happen to fatal crash risk if we intervened and changed the legal driving age?"

One way to tackle this is through a causal graph and the **do-operator**, as espoused by <a href="https://en.wikipedia.org/wiki/Causality_(book)">Judea Pearl</a>. Rather than asking about the observed distribution of $$Y$$ conditional on $$X=x$$, Pearl asks about the distribution of $$Y$$ after we *force* $$X$$ to take the value $$x$$:

$$
P(Y \mid do(X=x)).
$$

This gives us the distribution of $$Y$$ after we intervene and set $$X$$ equal to $$x$$, which is different from the ordinary conditional distribution $$P(Y \mid X=x)$$ which is associational. In the driving-age example, the observed quantity $$P(\text{fatal crash} \mid \text{age} = 20)$$ describes the fatal crash risk among people who are already 20 years old, but the policy-relevant quantity is closer to $$P(\text{fatal crash} \mid do(\text{legal driving age} = 20))$$. That interventional quantity asks what would happen if we changed the policy itself, and the answer depends on the causal structure. If the main reason younger drivers crash more is biological age, maturity, or risk preference, then raising the driving age might reduce fatal crashes. But if the main reason younger drivers crash more is lack of experience on the road, then raising the driving age may simply create inexperienced 20-year-old drivers instead of inexperienced 16-year-old drivers.

In that case, a better causal model might include both age and experience as separate causes of fatal crash risk:

$$
A \rightarrow Y
$$

$$
A \rightarrow E \rightarrow Y
$$

where age may directly affect crash risk through maturity, cognition, or risk-taking, while also indirectly affecting crash risk through driving experience. Once we draw the problem this way, it becomes clearer that "age" is not a magic causal variable. The effect of changing the legal driving age depends on which causal pathways are actually responsible for the observed association.

Pearl's graphical approach and the potential outcomes framework are different ways of formalizing the same basic principle that causal questions are questions about counterfactual or interventional worlds, rather than merely about observed associations. In the potential outcomes language, we might ask what a person's crash risk would be if they started driving at 16 versus if they started driving at 20. In Pearl's language, we might ask what happens to fatal crash risk under the intervention $$do(\text{legal driving age} = 20)$$.

While the frameworks are compatible, they each have their strengths and weaknesses depending on the setting; my expertise in causal inference mainly comes from econometrics and the social sciences, where the potential outcomes framework is often preferred over Pearl's graphical approach. <a href="https://arxiv.org/pdf/1907.07271">As explained by Guido Imbens</a>, this preference is not because economists reject DAGs altogether (in fact, they're an excellent mental model for thinking about causal relationships), but because much of empirical economics is organized around identification strategies where the potential outcomes framework is especially natural, such as randomized experiments and quasi-experimental designs. These settings often involve relatively few variables, clearly defined interventions, and assumptions about assignment mechanisms, treatment heterogeneity, monotonicity, exclusion restrictions, or study design that are often easier to express in potential outcomes notation than in a DAG. Imbens argues that DAGs are valuable for visualizing assumptions and systematically reasoning about identification, especially in complex causal systems with many variables, but that the potential outcomes framework has historically been more useful for the kinds of policy-relevant empirical questions economists tend to study.

Both frameworks have their merits and I think are best used in tandem. In particular, DAGs make certain types of causal structures visually clear:

- **Confounders**

A **confounder** is a common cause of both the treatment and the outcome. Let's go back to our study of the effect of eating ice cream on drowning risk. Hot weather affects whether people eat ice cream, and hot weather also affects whether people go swimming, which affects drowning risk. A simple DAG might look like this:

$$
\text{Hot Weather} \rightarrow \text{Ice Cream}
$$

$$
\text{Hot Weather} \rightarrow \text{Swimming} \rightarrow \text{Drowning}
$$


If we omit hot weather, we may observe an association between ice cream and drowning even if ice cream has no causal effect on drowning. The path

$$
\text{Ice Cream} \leftarrow \text{Hot Weather} \rightarrow \text{Swimming} \rightarrow \text{Drowning}
$$

is a **backdoor path** from ice cream to drowning. It creates a non-causal association between treatment and outcome.

In this case, conditioning on hot weather blocks the backdoor path. Once we compare ice cream eaters and non-ice cream eaters within the same weather conditions, the spurious association should disappear, assuming the DAG is correct.

- **Mediators**

A **mediator** is a variable that lies on the causal pathway from treatment to outcome. For example, in the driving-age case:

$$
\text{Age} \rightarrow \text{Driving Experience} \rightarrow \text{Fatal Crash Risk}
$$

Driving experience is a mediator of the effect of age on fatal crash risk. If we are trying to estimate the total effect of age on crash risk, controlling for driving experience may be a mistake, because it blocks part of the causal pathway through which age affects crash risk. But if we are trying to isolate the direct effect of age holding experience fixed, then controlling for driving experience may be exactly what we want.

This is why the estimand matters, because "what is the total effect of age on crash risk" and "what is the effect of age on crash risk holding driving experience fixed" are different causal questions that require different treatment of background covariates for identification.

- **Colliders**

A **collider** is a variable that is caused by two other variables. For example:

$$
X \rightarrow C \leftarrow Y
$$

Here, $$C$$ is a collider. Unlike confounders, colliders should generally not be controlled for. Conditioning on a collider can induce a spurious association between its causes, even if those causes are otherwise unrelated.

Nate Silver has an <a href="https://www.natesilver.net/p/elon-musk-and-spiky-intelligence#:~:text=There%E2%80%99s%20also%20a%20statistical%20phenomenon%20called%20Berkson%E2%80%99s%20paradox%20that%20helps%20to%20explain%20why%2C%20in%20any%20given%20field%2C%20successful%20people%20often%20seem%20to%20have%20some%20sort%20of%20Achilles%E2%80%99%20heel">example of collider bias</a> in NBA prospects in one of his blogposts. In general, there might be a positive association between an NBA prospect's ability to shoot the ball and how good their defensive rating is; but to be drafted to the NBA, you need to either be an exceptionally good shooter, or an exceptionally good defender. If you looked at just players in the NBA to find an association between shooting and defense, you might find a negative association between the two skills because you conditioned on the selection mechanism. This is sometimes referred to as "Berkson's paradox."

<div style="text-align: center; padding: 10px">
<img src="/assets/article_images/2026-06-04-images/nba_berksons_nate_silver.png" alt="Berkson's Paradox: Selection on NBA Players overturns association between shooting and defense, example provided by Nate Silver" title="Berkson's Paradox: Selection on NBA Players overturns association between shooting and defense, example provided by Nate Silver" width="700">
</div>

An even more illustrative example, in my opinion, is the question of whether height makes someone better at basketball in the general population. If you looked at the NBA, you'd find that there's probably no association between height and skill, and some of the most skilled basketball players are relatively short by NBA standards (my GOAT Steph Curry is "only" 6'3).

But the problem with doing this is that you've conditioned on the collider variable: being drafted to the NBA! To make the NBA, you either need to be really skilled, or really tall (ideally both), so conditioning on people who have already made the NBA distorts the true population association between height and basketball skill.

$$
\text{Basketball Skill} \rightarrow \text{Drafted into the NBA} \leftarrow \text{Height}
$$

If you doubt this relationship, ask yourself why there was only <a href="https://www.nba.com/stats/players/bio?dir=A&sort=PLAYER_HEIGHT_INCHES">one player in the NBA this past season listed as below 6 feet tall</a>, and also ask yourself who you would want on your pickup team at your local park if you had a random panel of players: a team of 6'8 giants who can probably dunk even if they've never touched a basketball before, or a 5'2 chud.


The main lesson from DAGs is that it's not correct to blindly control for every variable you observe. Some variables remove bias when controlled for (confounders), while some variables introduce bias when controlled for (colliders), and whether adjustment helps or hurts depends on the causal structure.

This brings us to the **backdoor criterion**, which gives us a graphical condition for identifying causal effects from observational data. Suppose we want to identify the causal effect of $$X$$ on $$Y$$. A set of variables $$S$$ satisfies the backdoor criterion if:

1. No variable in $$S$$ is a descendant of $$X$$.
2. $$S$$ blocks every path from $$X$$ to $$Y$$ that begins with an arrow into $$X$$.

The second condition targets backdoor paths: non-causal paths that create association between $$X$$ and $$Y$$ because of common causes. If we can block all such paths by conditioning on an appropriate set of variables $$S$$, then we can identify the causal effect of $$X$$ on $$Y$$ from observational data.

Formally, when the backdoor criterion holds, we can write:

$$
P(Y \mid do(X=x))
=
\sum_s P(Y \mid X=x, S=s)P(S=s).
$$

This is called the **adjustment formula**. It says that if we adjust for the right variables, then we can recover the interventional distribution $$P(Y \mid do(X=x))$$ using only observed quantities from the joint distribution. Importantly, the implication here is that even when we cannot run a randomized experiment, causal effects may still be identifiable from observational data if we understand the causal structure well enough.

Of course, that is a very big "if," and the DAG does not come from the data alone. It encodes assumptions that we, the human data modeler, make about the data-generating process. If the DAG is wrong, the adjustment set may be wrong, and the resulting causal estimate may still be biased. But the value of the DAG is that it makes those assumptions explicit.

Equivalently, in the potential outcomes framework, we have the **ignorability assumption**, where

$$
\{Y_i(1), Y_i(0)\} \perp Z_i \mid X_i.
$$

In words, treatment assignment is independent of the potential outcomes after conditioning on some set of observed covariates $$X_i$$. This is also sometimes called **conditional exchangeability**, **selection on observables**, or **unconfoundedness**.

If ignorability holds, then within strata of $$X_i$$, treatment assignment is "as good as random." Treated and control units with the same covariates are comparable, so differences in their observed outcomes can be interpreted causally. Formally:

$$
\mathbb{E}[Y_i(1) \mid X_i=x]
=
\mathbb{E}[Y_i^{obs} \mid Z_i=1, X_i=x]
$$

and

$$
\mathbb{E}[Y_i(0) \mid X_i=x]
=
\mathbb{E}[Y_i^{obs} \mid Z_i=0, X_i=x].
$$

Therefore, the conditional average treatment effect can be written as:

$$
\mathbb{E}[Y_i(1)-Y_i(0) \mid X_i=x]
=
\mathbb{E}[Y_i^{obs} \mid Z_i=1, X_i=x]
-
\mathbb{E}[Y_i^{obs} \mid Z_i=0, X_i=x].
$$

To recover the overall average treatment effect, we average over the distribution of $$X_i$$:

$$
\tau
=
\mathbb{E}_{X}
\left[
\mathbb{E}[Y_i^{obs} \mid Z_i=1, X_i]
-
\mathbb{E}[Y_i^{obs} \mid Z_i=0, X_i]
\right].
$$

This is the potential outcomes analogue of the adjustment formula. In DAG language, we identify a set of variables that blocks the relevant backdoor paths from treatment to outcome. In potential outcomes language, we assume that after conditioning on those variables, treatment assignment is independent of the potential outcomes. Again, this is a very strong assumption to make, and my prior is to be immediately skeptical of observational data that just picks and chooses external variables to "control for" since the space of omitted variables is huge (randomized design is a better way to go).

Also, note that the average treatment effect we've been using is a *linear* causal estimand, since the difference-in-means estimator $$\bar{Y}(1) - \bar{Y}(0) = \frac{1}{n} \sum_{i=1}^n \left(Y_i(1) - Y_i(0)\right)$$ is the average of the differences in individual potential outcomes. But estimands need not be linear in general; we could have used the median treatment effect $$\text{median}\{Y_i(1)\}_{i=1}^n - \text{median}\{Y_i(0)\}_{i=1}^n$$, for example, but this is in general not equal to the median of the differences in individual treatment effects $$\text{median}\{Y_i(1) - Y_i(0)\}_{i=1}^n$$. The first estimand compares two marginal distributions of potential outcomes, while the second requires reasoning about the unit-level pairing between $$Y_i(1)$$ and $$Y_i(0)$$. The ATE is special because linearity lets us write the difference in average potential outcomes as the average of individual-level differences, but that equivalence does not generally hold for nonlinear summaries like medians, quantiles, or ratios.

## A Code Example: LaLonde (1986)[^1]

In the 1970s, the US had a job-training program called the National Supported Work Demonstration to help disadvantaged workers (long-term welfare recipients, ex-convicts, ex-addicts, and unemployed school dropouts) enter the workforce. The program was administered as a large-scale field experiment, so eligible applicants were randomly assigned to either participate in the job-training program (treatment) or to not be part of it (control) and the study tracked their real earnings in 1978 as the main outcome of interest.

In 1986, Robert LaLonde published a <a href="https://www.jstor.org/stable/1806062">paper</a> that compared observational microdata from the Current Population Survey to the NSW randomized controlled trial, mainly to see if the causal effect of the program could still be identified from observational data. My goal is to reproduce his analysis to illustrate selection on observables versus randomization.

We'll start by loading in the observational CPS data, which uses a random sample from the *broader population* as the control group.

<a href="/assets/article_images/2026-06-04-images/cps1re74.csv" download>[Download cps1re74.csv]</a>

{% highlight python %}
# imports
import pandas as pd
import numpy as np

# Load the data
lalonde_cps = pd.read_csv("cps1re74.csv", sep=" ")
lalonde_cps
{% endhighlight %}

|  | treat | age | educ | black | hispan | married | nodegree | re74 | re75 | re78 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | 1 | 37 | 11 | 1 | 0 | 1 | 1 | 0.0 | 0.0 | 9930.0460 |
| 1 | 1 | 22 | 9 | 0 | 1 | 0 | 1 | 0.0 | 0.0 | 3595.8940 |
| 2 | 1 | 30 | 12 | 1 | 0 | 0 | 0 | 0.0 | 0.0 | 24909.4500 |
| 3 | 1 | 27 | 11 | 1 | 0 | 0 | 1 | 0.0 | 0.0 | 7506.1460 |
| 4 | 1 | 33 | 8 | 1 | 0 | 0 | 1 | 0.0 | 0.0 | 289.7899 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 16172 | 0 | 22 | 12 | 1 | 0 | 0 | 0 | 3980.0 | 6800.0 | 2760.0000 |
| 16173 | 0 | 20 | 12 | 1 | 0 | 1 | 0 | 1450.0 | 11800.0 | 6900.0000 |
| 16174 | 0 | 37 | 12 | 0 | 0 | 0 | 0 | 1730.0 | 1560.0 | 4220.0000 |
| 16175 | 0 | 47 | 9 | 0 | 0 | 1 | 1 | 16900.0 | 11400.0 | 13700.0000 |
| 16176 | 0 | 40 | 10 | 0 | 0 | 0 | 1 | 13600.0 | 13100.0 | 7980.0000 |

If we compute the naive difference-in-means estimator between the treatment and control groups...

{% highlight python %}
# Compute the diff-in-means estimator
naive_diff = lalonde_cps[lalonde_cps["treat"] == 1]["re78"].mean() - lalonde_cps[lalonde_cps["treat"] == 0]["re78"].mean()
print(naive_diff) # -8506.495361050387
{% endhighlight %}

...we find that individuals in the job-training program had real incomes that were $$\$8,506$$ *lower* than the control group in 1978.

Of course, this is an artifact of the fact that our control group is not directly comparable to the treatment group. The people in the NSW program were already much more likely to have weak labor-market attachment before treatment. Many had zero earnings in 1974 and 1975, lower educational attainment, and other baseline socioeconomic characteristics associated with lower future earnings. By contrast, the CPS controls are drawn from the broader population, so they are not a randomized comparison group for the NSW treated units.

In potential outcomes language, the issue is that treatment assignment is not ignorable:

$$
\{Y_i(1), Y_i(0)\} \not\perp Z_i.
$$

The treated and control groups likely had different potential earnings even before the job-training program, so the naive difference-in-means estimator is mixing up the causal effect of the program with pre-existing differences between the NSW participants and the CPS controls.

Now let's see what happens if we use data from the actual field experiment where treatment assignment was *randomized*. Here, the control group consists of people who were eligible for the job-training program but were randomly assigned to not partake, making them more directly comparable to those who were part of the program. We can once again compute the naive difference-in-means estimator:

{% highlight python %}
# pip install dowhy

import dowhy.datasets
lalonde = dowhy.datasets.lalonde_dataset()
lalonde["treat"] = lalonde["treat"].astype(int)

# Naive difference-in-means treatment effect:
experimental_diff = lalonde[lalonde["treat"] == 1]["re78"].mean() - lalonde[lalonde["treat"] == 0]["re78"].mean()
print(experimental_diff) # 1794.34240427027
{% endhighlight %}

With randomization giving us a comparable treatment and control group, this finding tracks our expectations a lot better; the randomized estimate suggests that the job-training program increased real income by about $$\$1,794$$ on average by 1978.

What happens when we control for background covariates like age, race, or education in the randomized experiment? We can use a covariate-adjusted regression, where the coefficient on the treatment indicator gives an adjusted estimate of the treatment effect after accounting for pre-treatment covariates.

{% highlight python %}
import statsmodels.formula.api as smf

# Create covariates for unemployment status in 1974 and 1975
lalonde["u74"] = (lalonde["re74"] == 0).astype(int)
lalonde["u75"] = (lalonde["re75"] == 0).astype(int)

formula = """
re78 ~ treat + age + educ + black + hisp + married + nodegr
       + re74 + re75 + u74 + u75
"""

ols_full = smf.ols(formula, data=lalonde).fit(cov_type="HC2")

print(ols_full.summary())

# Extract just the treatment estimate
print("Treatment coefficient:", ols_full.params["treat"])
print("Robust SE:", ols_full.bse["treat"])
print("p-value:", ols_full.pvalues["treat"])
{% endhighlight %}

| Variable | Coefficient | Robust SE | z | p-value | 95% CI Lower | 95% CI Upper |
|---|---:|---:|---:|---:|---:|---:|
| Intercept | 256.666 | 3732.433 | 0.069 | 0.945 | -7058.768 | 7572.101 |
| Treatment | 1670.709 | 682.319 | 2.449 | 0.014 | 333.389 | 3008.029 |
| Age | 53.571 | 42.147 | 1.271 | 0.204 | -29.036 | 136.178 |
| Education | 400.771 | 201.607 | 1.988 | 0.047 | 5.628 | 795.914 |
| Black | -2037.333 | 1043.280 | -1.953 | 0.051 | -4082.125 | 7.459 |
| Hispanic | 425.820 | 1437.074 | 0.296 | 0.767 | -2390.793 | 3242.433 |
| Married | -146.331 | 872.462 | -0.168 | 0.867 | -1856.324 | 1563.663 |
| No degree | -15.178 | 1055.399 | -0.014 | 0.989 | -2083.721 | 2053.365 |
| Earnings in 1974 | 0.123 | 0.134 | 0.920 | 0.358 | -0.140 | 0.386 |
| Earnings in 1975 | 0.020 | 0.147 | 0.134 | 0.893 | -0.269 | 0.308 |
| Unemployed in 1974 | 1380.282 | 1589.357 | 0.868 | 0.385 | -1734.800 | 4495.364 |
| Unemployed in 1975 | -1071.215 | 1430.209 | -0.749 | 0.454 | -3874.373 | 1731.943 |

In this specification with every covariate included, the coefficient on the treatment indicator shifts to $$1670.709$$. That doesn't mean our model is sensitive to covariate selection though; rather, in any finite randomized experiment, the treatment and control groups may still differ somewhat on background covariates just by chance. Regression adjustment accounts for those realized imbalances, which is why the estimate can wiggle slightly from the unadjusted difference-in-means estimate of $$1794.342$$. Randomization already makes treatment assignment independent of the potential outcomes in expectation, which means covariates are not needed for identification.

For fun, we can check to see how much the treatment coefficient changes across all $$2^{10}$$ regression specifications:

{% highlight python %}
import itertools
import matplotlib.pyplot as plt

covariates = [
    "age", "educ", "black", "hisp", "married", "nodegr",
    "re74", "re75", "u74", "u75"
]

results = []

# Iterate through every possible subset of covariates
for k in range(len(covariates) + 1):
    for subset in itertools.combinations(covariates, k):
        if len(subset) == 0:
            formula = "re78 ~ treat"
            covariate_set = "None"
        else:
            formula = "re78 ~ treat + " + " + ".join(subset)
            covariate_set = ", ".join(subset)
        
        model = smf.ols(formula, data=lalonde).fit(cov_type="HC2")
        
        results.append({
            "num_covariates": k,
            "covariates": covariate_set,
            "treat_coef": model.params["treat"],
            "treat_se": model.bse["treat"],
            "p_value": model.pvalues["treat"],
            "formula": formula
        })

results_df = pd.DataFrame(results)

# Histogram of treatment effect estimates

plt.figure(figsize=(8, 5))
plt.hist(results_df["treat_coef"], bins=30, edgecolor="black", alpha=0.75)

# Add the unadjusted experimental difference-in-means as a reference line
plt.axvline(experimental_diff, linestyle="--", linewidth=2, label="Unadjusted diff-in-means")

plt.xlabel("Estimated treatment coefficient")
plt.ylabel("Number of covariate specifications")
plt.title("Treatment Effect Estimates Across Covariate Adjustments")
plt.legend()
plt.show()
{% endhighlight %}

<div style="text-align: center; padding: 10px">
<img src="/assets/article_images/2026-06-04-images/treatment_effect_estimates_cre.png" alt="Treatment Effect Estimates Across Covariate Adjustments in the Completely Randomized NSW Experiment" title="Treatment Effect Estimates Across Covariate Adjustments in the Completely Randomized NSW Experiment" width="700">
</div>

{% highlight python %}

# Comparing the largest and smallest treatment effect estimates across different specifications

bottom5 = results_df.sort_values("treat_coef").head(5)
top5 = results_df.sort_values("treat_coef").tail(5)

unadjusted = pd.DataFrame([{
    "covariates": "Unadjusted diff-in-means",
    "treat_coef": experimental_diff,
    "treat_se": (
        lalonde[lalonde["treat"] == 1]["re78"].var(ddof=1) / sum(lalonde["treat"] == 1)
        + lalonde[lalonde["treat"] == 0]["re78"].var(ddof=1) / sum(lalonde["treat"] == 0)
    ) ** 0.5
}])

full = pd.DataFrame([{
    "covariates": "Full regression",
    "treat_coef": ols_full.params["treat"],
    "treat_se": ols_full.bse["treat"]
}])

plot_df = pd.concat([bottom5, unadjusted, full, top5], ignore_index=True)

# 95% CIs
plot_df["ci_low"] = plot_df["treat_coef"] - 1.96 * plot_df["treat_se"]
plot_df["ci_high"] = plot_df["treat_coef"] + 1.96 * plot_df["treat_se"]

# Labels
plot_df["label"] = plot_df["covariates"]

# Plot
plt.figure(figsize=(10, 8))
y = range(len(plot_df))
plt.errorbar(
    plot_df["treat_coef"],
    y,
    xerr=[
        plot_df["treat_coef"] - plot_df["ci_low"],
        plot_df["ci_high"] - plot_df["treat_coef"]
    ],
    fmt="o",
    capsize=4
)

plt.axvline(0, linestyle="--", linewidth=1, color="red")
plt.axvline(experimental_diff, linestyle=":", linewidth=2, label="Unadjusted diff-in-means")
plt.yticks(y, plot_df["label"])
plt.xlabel("Estimated treatment effect on 1978 earnings")
plt.title("Selected Treatment Effect Estimates Across Covariate Specifications")
plt.legend()
plt.tight_layout()
plt.show()
{% endhighlight %}

<div style="text-align: center; padding: 10px">
<img src="/assets/article_images/2026-06-04-images/treatment_effects_by_specification.png" alt="Selected Treatment Effect Estimates Across Covariate Specifications" title="Selected Treatment Effect Estimates Across Covariate Specifications" width="700">
</div>

Across many covariate specifications, the estimated treatment coefficient moves around somewhat, but it does not swing wildly from a large negative number to a large positive number like it did in the observational CPS comparison. Even when we compare the five largest treatment effect estimates against the five smallest treatment effect estimates, the point estimates remain in the same general range, and their 95% confidence intervals overlap substantially with each other as well as with the unadjusted difference-in-means estimate. With randomization, covariates are not needed to make the treated and control groups comparable in expectation, but covariate adjustment is still useful for improving precision, accounting for chance imbalances in the realized sample, or studying treatment effect heterogeneity across subgroups[^2].

Let's return once again to our observational CPS data. Can we recover our "ground truth" treatment effect through selection on observables?

{% highlight python %}
lalonde_cps["u74"] = (lalonde_cps["re74"] == 0).astype(int)
lalonde_cps["u75"] = (lalonde_cps["re75"] == 0).astype(int)

covariates = [
    "age", "educ", "black", "hispan", "married", "nodegree",
    "re74", "re75", "u74", "u75"
]

formula = "re78 ~ treat + " + " + ".join(covariates)

ols_adjusted = smf.ols(formula, data=lalonde_cps).fit(cov_type="HC2")
print(ols_adjusted.summary())
{% endhighlight %}

| Variable | Coefficient | Robust SE | z | p-value | 95% CI Lower | 95% CI Upper |
|---|---:|---:|---:|---:|---:|---:|
| Intercept | 5762.180 | 443.456 | 12.994 | 0.000 | 4893.022 | 6631.338 |
| Treatment | 1067.546 | 628.439 | 1.699 | 0.089 | -164.171 | 2299.264 |
| Age | -94.541 | 5.893 | -16.044 | 0.000 | -106.090 | -82.992 |
| Education | 175.226 | 28.917 | 6.059 | 0.000 | 118.548 | 231.903 |
| Black | -811.089 | 197.230 | -4.112 | 0.000 | -1197.653 | -424.524 |
| Hispanic | -230.535 | 218.413 | -1.055 | 0.291 | -658.617 | 197.547 |
| Married | 153.228 | 144.711 | 1.059 | 0.290 | -130.400 | 436.857 |
| No degree | 342.927 | 175.513 | 1.954 | 0.051 | -1.073 | 686.926 |
| Earnings in 1974 | 0.291 | 0.016 | 18.771 | 0.000 | 0.261 | 0.322 |
| Earnings in 1975 | 0.443 | 0.016 | 27.752 | 0.000 | 0.411 | 0.474 |
| Unemployed in 1974 | 355.556 | 233.727 | 1.521 | 0.128 | -102.541 | 813.654 |
| Unemployed in 1975 | -1612.758 | 250.291 | -6.444 | 0.000 | -2103.320 | -1122.196 |


{% highlight python %}
results_cps = []

for k in range(len(covariates) + 1):
    for subset in itertools.combinations(covariates, k):
        if len(subset) == 0:
            formula = "re78 ~ treat"
            covariate_set = "None"
        else:
            formula = "re78 ~ treat + " + " + ".join(subset)
            covariate_set = ", ".join(subset)
        
        model = smf.ols(formula, data=lalonde_cps).fit(cov_type="HC2")
        
        results_cps.append({
            "num_covariates": k,
            "covariates": covariate_set,
            "treat_coef": model.params["treat"],
            "treat_se": model.bse["treat"],
            "p_value": model.pvalues["treat"],
            "formula": formula
        })

results_cps_df = pd.DataFrame(results_cps)


# Histogram of observational treatment effects
plt.figure(figsize=(8, 5))
plt.hist(results_cps_df["treat_coef"], bins=30, edgecolor="black", alpha=0.75)

# Observational benchmarks
plt.axvline(
    naive_diff,
    linestyle="--",
    linewidth=2,
    label="CPS unadjusted diff-in-means"
)

plt.axvline(
    ols_adjusted.params["treat"],
    linestyle="-.",
    linewidth=2,
    label="CPS full regression"
)

# Experimental benchmarks
plt.axvline(
    experimental_diff,
    linestyle=":",
    linewidth=2,
    label="Experimental diff-in-means",
    color="red"
)

plt.axvline(
    ols_full.params["treat"],
    linestyle="-",
    linewidth=2,
    label="Experimental full regression",
    color="red"
)

plt.xlabel("Estimated treatment coefficient")
plt.ylabel("Number of covariate specifications")
plt.title("CPS Observational Estimates Across Covariate Adjustments")
plt.legend()
plt.tight_layout()
plt.show()
{% endhighlight %}

<div style="text-align: center; padding: 10px">
<img src="/assets/article_images/2026-06-04-images/treatment_effect_estimates_obs.png" alt="CPS Observational Estimates Across Covariate Adjustments" title="CPS Observational Estimates Across Covariate Adjustments" width="700">
</div>

{% highlight python %}

# Comparing high/low observational treatment effect estimates

results_cps_adj = results_cps_df[results_cps_df["covariates"] != "None"]

bottom5_cps = results_cps_adj.sort_values("treat_coef").head(5)
top5_cps = results_cps_adj.sort_values("treat_coef").tail(5)

cps_unadjusted = pd.DataFrame([{
    "covariates": "CPS unadjusted diff-in-means",
    "treat_coef": naive_diff,
    "treat_se": (
        lalonde_cps[lalonde_cps["treat"] == 1]["re78"].var(ddof=1) / sum(lalonde_cps["treat"] == 1)
        + lalonde_cps[lalonde_cps["treat"] == 0]["re78"].var(ddof=1) / sum(lalonde_cps["treat"] == 0)
    ) ** 0.5
}])

cps_full = pd.DataFrame([{
    "covariates": "CPS full regression",
    "treat_coef": ols_adjusted.params["treat"],
    "treat_se": ols_adjusted.bse["treat"]
}])

exp_unadjusted = pd.DataFrame([{
    "covariates": "Experimental diff-in-means",
    "treat_coef": experimental_diff,
    "treat_se": (
        lalonde[lalonde["treat"] == 1]["re78"].var(ddof=1) / sum(lalonde["treat"] == 1)
        + lalonde[lalonde["treat"] == 0]["re78"].var(ddof=1) / sum(lalonde["treat"] == 0)
    ) ** 0.5
}])

exp_full = pd.DataFrame([{
    "covariates": "Experimental full regression",
    "treat_coef": ols_full.params["treat"],
    "treat_se": ols_full.bse["treat"]
}])

plot_cps_df = pd.concat(
    [bottom5_cps, cps_unadjusted, cps_full, exp_unadjusted, exp_full, top5_cps],
    ignore_index=True
)

plot_cps_df["ci_low"] = plot_cps_df["treat_coef"] - 1.96 * plot_cps_df["treat_se"]
plot_cps_df["ci_high"] = plot_cps_df["treat_coef"] + 1.96 * plot_cps_df["treat_se"]
plot_cps_df["label"] = plot_cps_df["covariates"]

plt.figure(figsize=(10, 9))
y = range(len(plot_cps_df))

plt.errorbar(
    plot_cps_df["treat_coef"],
    y,
    xerr=[
        plot_cps_df["treat_coef"] - plot_cps_df["ci_low"],
        plot_cps_df["ci_high"] - plot_cps_df["treat_coef"]
    ],
    fmt="o",
    capsize=4
)

plt.axvline(0, linestyle="--", linewidth=1, color="red")

# Experimental benchmarks
plt.axvline(
    experimental_diff,
    linestyle=":",
    linewidth=2,
    color="black",
    label="Experimental diff-in-means"
)

plt.axvline(
    ols_full.params["treat"],
    linestyle="-.",
    linewidth=2,
    color="black",
    label="Experimental full regression"
)

plt.yticks(y, plot_cps_df["label"])
plt.xlabel("Estimated treatment effect on 1978 earnings")
plt.title("Selected CPS Estimates vs. Experimental Benchmarks")
plt.legend()
plt.tight_layout()
plt.show()
{% endhighlight %}

<div style="text-align: center; padding: 10px">
<img src="/assets/article_images/2026-06-04-images/treatment_effects_by_specification_obs.png" alt="Selected CPS Estimates vs. Experimental Benchmarks" title="Selected CPS Estimates vs. Experimental Benchmarks" width="700">
</div>

The full regression adjustment gets us closer to the experimental benchmark, as the treatment coefficient moves from the naive CPS estimate of roughly $$-\$8,506$$ to about $$\$1,068$$. But even this fully adjusted estimate is not statistically significant at the 5% level (i.e., its 95% confidence interval crosses zero). More broadly, selection on observables is highly sensitive to specification choice; across the $$2^{10}$$ possible covariate-adjusted regressions, a substantial share of treatment effect estimates are still *negative*, and the estimates range from about $$-\$8,526$$ to $$\$2,954$$. It is possible to find specifications that land near the experimental benchmarks, but doing so requires choosing a particular adjustment set after the fact, which is difficult to justify at best and starts to look like specification searching or p-hacking at worst. Regression adjustment on observational data can help, but unlike randomization, it does not give us comparability by design and only works if the included covariates are sufficient to make treatment assignment ignorable. Which, in practice, is a strong assumption and often difficult to justify. (My personal rule of thumb is to always be skeptical of regression adjustments on observational data.)

## Resources

- Peng Ding, <a href="https://arxiv.org/pdf/2305.18793">"A First Course in Causal Inference"</a>
- Scott Cunningham, <a href="https://mixtape.scunning.com/">"Causal Inference: The Mixtape"</a>
- Nick Huntington-Klein, <a href="https://www.theeffectbook.net/index.html">"The Effect: An Introduction to Research Design and Causality"</a>
- Kevin Murphy, <a href="https://probml.github.io/pml-book/book1.html">"Probabilistic Machine Learning"</a> Ch. 36 *Causality*, by Victor Veitch and Alex D'Amour

---

#### Footnotes
[^1]: <small>Code in this section partially generated with the help of ChatGPT!</small>
[^2]: <small>To actually do this properly you would need interaction terms in your regression specification, which I have omitted from this toy example for simplicity. But, I'll be sure to cover them in a future post.</small>