---
layout: post
title:  "Notes with Nav: Measure Theory over Chipotle"
subtitle: "Some BOWLICIOUS notes on basic measure theory and probability"
date:   2026-03-26 00:00:00 -0500
categories: jekyll update
---

Early last week, my friends and I convened at the Foster City Chipotle for another evening classic of bowls and banter. During one of our very enlightened and philosophical conversations – concerning how attractive people are, if we assume attractiveness is a continuous distribution – one of my friends asked if the average attractiveness score being a 5 out of 10 implies someone in the population has to be a 5 on the attractiveness scale.[^1]

For some reason, my friends' eyes all darted towards me, as if I'm the authority on statistics here for what is essentially an eighth grade statistics question.

The answer is obviously no, and we can come up with some very simple counterexamples to show why this isn't true. In a population of two people with attractiveness scores of 4 and 6, the mean and median attractiveness score is a 5, yet neither person in the population is a 5 on the attractiveness scale. QED.

A more interesting question, however, that one of my friends even momentarily alluded to, is that if someone having any given attractiveness score drawn from the continuous distribution occurs with probability 0, then how can it also be true that someone in the population has that attractiveness score?

The answer, in case you don't want to read all the math below, basically boils down to "probability 0 does not mean impossible." If you think that's an unintuitive and unsatisfying explanation, then get in, loser. We're learning measure theory.

<div style="text-align: center; padding: 25px">
<img src="/assets/article_images/2026-03-26-images/get_in_loser.png" alt="Get in, loser. We're learning Measure Theory." title="Get in, loser. We're learning Measure Theory." width="550">
</div>


## Measurable Spaces and Probability

Suppose we have a coin, where, if we flip it, it can turn up either heads (H) or tails (T). We can define $$\Omega = \{H, T\}$$ as the **sample space** of the coin-flipping experiment.

<div style="text-align: center; padding: 25px">
<img src="/assets/article_images/2026-03-26-images/sample_space.png" alt="Coin Toss Sample Space" title="Coin Toss Sample Space" width="550">
</div>

Once we have listed all possible outcomes, which collections of outcomes are we actually allowed to call events and assign probabilities to?

Well, of course, we already know about the event that the coin lands heads ($$\{H\}$$) and the event that the coin lands tails ($$\{T\}$$). We can also talk about the event that the coin lands neither heads nor tails, the empty set $$\emptyset$$, as well as the event that the coin lands either heads or tails, which is just the sample space $$\Omega$$.

<div style="text-align: center; padding: 25px">
<img src="/assets/article_images/2026-03-26-images/sigma_algebra.png" alt="Coin Toss Sigma Algebra" title="Coin Toss Sigma Algebra" width="800">
</div>

For such a tiny sample space, it is easy to take all subsets of $$\Omega$$ as legitimate events. But in general, especially when the sample space is large or continuous, we need to be more careful about which subsets we allow ourselves to measure.

To do so, we can define the **$$\sigma$$-algebra** $$\mathcal{F}$$, which is the collection of subsets of $$\Omega$$ that we agree to treat as measurable events. A $$\sigma$$-algebra must satisfy the following properties:

1. It must contain the empty set, i.e. $$\emptyset \in \mathcal{F}$$
2. For any event in the $$\sigma$$-algebra, its complement must also be in the $$\sigma$$-algebra, i.e. $$A \in \mathcal{F} \implies A^C \in \mathcal{F}$$
3. For any set of events in the $$\sigma$$-algebra, the union of those events (the event that any of them occur) must also be in the $$\sigma$$-algebra, i.e. $$A_1, A_2, ... \in \mathcal{F} \implies \bigcup_{i=1}^\infty A_i \in \mathcal{F}$$

This is all to say that the $$\sigma$$-algebra is a construct that allows us to talk about an event, its complement, and the union of countably many events. The $$\sigma$$-algebra of the coin-flipping example is

$$\mathcal{F} = \{\emptyset, \{H\}, \{T\}, \Omega\}$$

So far, the notion of any of these events having a probability has not come into play just yet, but we can begin formalizing ideas that build toward it. A probability model is not just a set of outcomes $$\Omega$$, but a pair $$(\Omega,\mathcal F)$$, called a measurable space, which tells us which subsets of the sample space we are allowed to treat as events.

We can now define a notion of "**measure**," which gives us an idea of the "size" of subsets in the sample space. Formally, for a measurable space $$(\Omega,\mathcal F)$$, a measure is a function $$\nu:\mathcal F \mapsto [0,\infty]$$ that assigns to each event $$A\in\mathcal F$$ a nonnegative extended real number $$\nu(A)$$. A measure must satisfy the following three properties:

1. **Non-negativity**: the function maps sets in the $$\sigma$$-algebra to non-negative numbers, i.e. $$\nu(A) \geq 0$$ for all $$A \in \mathcal{F}$$
2. **The empty set maps to 0**: $$\nu(\emptyset) = 0$$
3. **Countable additivity**: a countable union of pairwise disjoint events is simply the sum of their measures, i.e. $$\nu\left(\bigcup_{i=0}^\infty A_i \right) = \sum_{i=0}^\infty \nu(A_i)$$

We call the triple $$(\Omega, \mathcal{F}, \nu)$$ a *measure space*.

In the special case where the sum of all disjoint events in the sample space equals 1, i.e. $$\nu(\Omega) = 1$$, then $$\nu$$ is called a **probability measure** $$P$$ and $$(\Omega, \mathcal{F}, P)$$ is a **probability space**.

Combined with the previous three properties, these gives us the <a href="https://statproofbook.github.io/D/prob-ax.html">**Kolmogorov axioms**</a> that underpin probability.

<div style="text-align: center; padding: 25px">
<img src="/assets/article_images/2026-03-26-images/measure.png" alt="Coin Toss Measure Space" title="Coin Toss Measure Space" width="800">
</div>

And so, at long last, we have a rigorous definition of probability; it is a measure on the space of events that assigns total mass 1 to the entire sample space.

## Discrete and Continuous Distributions

In our fair coin example, the sample space is finite: $$\Omega={H,T}$$.

One natural notion of size on a finite or countable space is the **counting measure**, which simply counts how many outcomes are in a set. If we denote counting measure by $$\#$$, then

$$
\#(\emptyset)=0, \#(\{H\})=1, \#(\{T\})=1, \#(\Omega)=2.
$$

This is not yet a probability measure, since the total mass of the sample space is $$2$$ rather than $$1$$. But we can convert it into a probability measure by normalizing:

$$
P(A)=\frac{\#(A)}{2}
$$

So in the fair coin case,
$$
P(\emptyset)=0, P(\{H\})=\frac{1}{2}, P(\{T\})=\frac{1}{2}, P(\Omega) = 1
$$

This is the basic idea behind discrete distributions more generally: probabilities are assigned by placing mass on individual outcomes and summing over them. The fair coin illustrates the case of a Bernoulli(0.5) random variable, but more generally, this discrete framework extends to other random variables like the Binomial and Poisson, whose probability distributions are defined on countable sample spaces and can be viewed as assigning weights relative to counting measure.

For continuous distributions, however, such as our "attractiveness" motivating example from the intro, counting no longer makes sense. If our sample space is the real line, or some interval of it, then even a tiny interval contains infinitely many points.

In that setting, the more natural notion of size is **Lebesgue measure**, which corresponds to ordinary length on the real line.

For example, if $$\lambda$$ denotes Lebesgue measure, then

$$
\lambda([a,b])=b-a
$$

So the interval $$[4,6]$$ has Lebesgue measure $$2$$, while a single point like $$\{5\}$$ has Lebesgue measure $$0$$.[^2]

<div style="text-align: center; padding: 25px">
<img src="/assets/article_images/2026-03-26-images/lebesgue.png" alt="Lebesgue Measure" title="Lebesgue Measure" width="800">
</div>

This idea that *singleton sets* like $$\{5\}$$ in a continuous space like $$\mathbb{R}$$ have Lebesgue measure $$0$$ is what gives us the notion that the probability of drawing any particular "number" from a continuous distribution is 0. In a discrete distribution like our fair coin toss, the outcome $$H$$ has probability $$\frac{1}{2}$$ all by itself, but in a continuous distribution, probability behaves more like *length* (given by the Lebesgue measure) than like *counting*.

Earlier, we normalized the counting measure to create a probability measure with a mass that summed to 1 in the coin flip example, and we can use that same principle in the continuous case. Some continuous probability measures can be obtained by simply normalizing Lebesgue measure on a finite interval, such as the uniform distribution on $$[0,1]$$. But in general, continuous distributions are not just normalized length, since they weight different regions of the real line differently. (This is true for discrete distributions, too; our example earlier was just easy.)

To do this, we represent a probability measure more concretely using a **density function** with respect to some underlying measure, like Lebesgue measure on the real line.

Suppose we have a measurable space $$(\Omega,\mathcal{F})$$ and two measures $$P$$ and $$\nu$$. If $$P$$ is absolutely continuous with respect to $$\nu$$ (meaning $$P(A)=0$$ whenever $$\nu(A)=0$$), then the <a href="https://en.wikipedia.org/wiki/Radon%E2%80%93Nikodym_theorem">**Radon–Nikodym theorem**</a> tells us that there exists a function $$p: \mathcal{F} \mapsto [0, \infty)$$ such that

$$ 
P(A)=\int_A p(x)d\nu(x) \quad \text{for all } A \in \mathcal{F}.
$$

This function $$p$$ is called the *Radon–Nikodym derivative* of $$P$$ with respect to $$\nu$$, and is often written as $$\frac{dP}{d\nu}(x)$$. When $$P$$ is a probability measure and $$\nu$$ is the Lebesgue measure, we call $$p(x)$$ a *probability density function*. In other words, we know that a density exists precisely when a probability measure is absolutely continuous with respect to Lebesgue measure.[^3]

Formally, if a random variable $$X$$ has density $$f$$, then the probability that $$X$$ falls in some set $$A$$ is given by

$$
P(X \in A) = \int_A f(x)d\lambda(x)
$$

where $$\lambda$$ denotes Lebesgue measure. So probability is obtained by integrating the density over sets, not by assigning weight directly to individual points. (In the discrete case, we would instead *sum* over the outcomes in $$A$$ weighted by a probability *mass* function $$p(x)$$).

Now, if $$A = \{5\}$$ is a singleton set, then its Lebesgue measure is $$0$$. Since integrating over a set of Lebesgue measure $$0$$ gives $$0$$, we get

$$
P(X = 5) = P(X \in \{5\}) = \int_{\{5\}} f(x)d\lambda(x) = 0
$$

<div style="text-align: center; padding: 25px">
<img src="/assets/article_images/2026-03-26-images/probability_density.png" alt="Probability Density" title="Probability Density" width="800">
</div>

## Lebesgue Measure 0 Does Not Imply "Impossible"

At first glance, this feels paradoxical. If every exact number has probability $$0$$, then how can a continuous random variable ever take on any value at all?

The answer is that probability measures are **countably additive**, not uncountably additive. Recall our third property of a measure: if we have a countable collection of pairwise disjoint events $$A_1,A_2,\dots$$, then

$$
P\left(\bigcup_{i=1}^{\infty} A_i\right)=\sum_{i=1}^{\infty} P(A_i)
$$

But the interval $$[0,1]$$ is not a countable union of points in any way that allows us to write its probability as a countable sum. It is an *uncountable* union:

$$
[0,1]=\bigcup_{x\in[0,1]}\{x\}
$$

Measure theory does NOT require probability to be additive over uncountably many sets. In other words, the countable additivity rule only applies when the collection of disjoint sets is, well, countable. You are not allowed to extend that rule to an uncountable family of singleton sets and conclude that the probability of an interval must be the "sum" of uncountably many zeroes. (What you *can* do is define countable additivity over countable collections of pairwise disjoint measurable sets, which is exactly the setting in which Lebesgue measure satisfies additivity.) We simply do not define probability that way in measure theory.

Crucially, this does NOT mean that sets themselves must be countable in order to have a well-defined probability. The interval $$[0,1]$$ is uncountable, but that is not a problem, because measure is not defined by summing over individual points. Instead, we assign probability directly to sets like intervals (via length, in the case of Lebesgue measure), and only use additivity when combining countably many disjoint pieces. The mistake is trying to treat an interval as if it were just a sequence of points when it isn’t.

<div style="text-align: center; padding: 25px">
<img src="/assets/article_images/2026-03-26-images/countable_additivity.png" alt="Countable Additivity" title="Countable Additivity" width="800">
</div>

So there is no contradiction. Every individual point can have probability 0, while an interval containing uncountably many such points can still have positive probability. Probability 👏 0 👏 does 👏 not 👏 mean 👏 impossibility 👏; it means that single points are too small, in the measure-theoretic sense, to carry positive mass on their own.

This is why in formal probability-speak, we don't use the term "impossible" to describe events with probability 0. An outcome with probability 0 can still be a member of the sample space and therefore "possible," but it is so small relative to the continuum of real numbers it lives on that it has a probability of 0. We would describe such an event as occurring **"almost never,"** while an event that happens with probability 1 happens <a href="https://en.wikipedia.org/wiki/Almost_surely">**"almost surely."**</a>

Let's revisit the attractiveness example. The event that a randomly drawn individual has an exact attractiveness score of 5 has probability 0, so it occurs *almost never*. Does that mean there exists no one in the population with an attractiveness of 0, or that it is impossible to have an attractiveness of 0? No! The way we construct probability when talking about events drawn from a continuous distribution of outcomes is fundamentally reliant on taking probabilities over intervals of outcomes; the probability of a single point is 0 because it has no length (Lebesgue measure $$0$$). Think of it this way: you currently exist with some attractiveness score, so clearly, it is *possible* to attain such a score; however, the probability of that single, exact score being drawn from the attractiveness distribution is 0.

So what *is* an impossible event? Well, the way we talk about attractiveness is on a truncated scale of 0 to 10, which makes it quite a stupid way of talking about how attractive people are since there's no scientific reason the distribution needs to be squished to that range of values. (Now would probably be a good time to say that I don't endorse talking about attractiveness like this, but it's an illustrative example and I try to keep it real$$^{\text{TM}}$$ around here.) But yes, if attractiveness is modeled as a continuous distribution on $$(0,10)$$, then values outside this range, called the *support* of the distribution, are what we would describe as "impossible." So while the probability of having an attractiveness score of 5 is 0 but still possible (it occurs almost never), it is impossible to have an attractiveness score of 11 or -1, since those values lie outside the support of the distribution.

## So why is the probability of a single event on a continuous distribution 0 but still possible? (I didn't read the post)

Basically, it just boils down to the way probability is defined and constructed. In the continuous case, probability is specifically defined by integrating the distribution’s density function over sets on the real line with respect to Lebesgue measure. Since a single point has Lebesgue measure $$0$$ (i.e., it has no length since it's not an interval of values), it follows by construction that any exact value has probability $$0$$.

But this doesn't make those values *impossible*. In probability theory, "impossible" is usually reserved for outcomes outside the support or outside the sample space altogether. A value can still be possible while having probability 0 if it lies within the continuum of allowable outcomes.

If you spun up a Python program to draw a random number on a continuous range of values from 0 to 10 (pseudorandomness of computers notwithstanding), any individual value you draw has probability 0; and yet, that exact value was realized when you drew it. In a continuous model, individual points are possible, but they are too small, in the measure-theoretic sense, to carry positive probability mass on their own.

Also, I covered a lot less about measure theory than I anticipated when I first started writing this post. It's definitely worth reading about if you want to transcend your mind to a different dimension to think about probability, so here are some other accessible readings on measure theory (which I also referenced to write this post!):
- Prof. Will Fithian's <a href="https://www.stat.berkeley.edu/~wfithian/courses/stat210a/measure-theory-basics.html">notes from Stat 210A</a> at Berkeley (very basic intro)
- Prof. Yuan Ji from UChicago's notes on probability, adapted from the <a href="https://studylib.net/doc/26076856/mathematical-statistics-2nd-edition?p=11">*Mathematical Statistics (2nd Edition)* textbook</a> by Shao: 
- This <a href="https://www.youtube.com/watch?v=xZ69KEg7ccU&list=PLBh2i93oe2qvMVqAzsX1Kuv6-4fjazZ8j">YouTube playlist</a> by The Bright Side of Mathematics
- These <a href="https://www.math.ucdavis.edu/~hunter/m206/ch1_measure.pdf">notes on the Lebesgue measure on $$\mathbb{R}^n$$</a> from UC Davis
- Slightly less "accessible" but definitely comprehensive, Terence Tao's <a href="https://terrytao.wordpress.com/wp-content/uploads/2012/12/gsm-126-tao5-measure-book.pdf"> measure theory notes</a>

---
#### Footnotes
[^1]: <small>Incidentally, we were talking about the attractiveness of men that we know, including ourselves. I learned that my friends think way too highly of their own attractiveness.</small>
[^2]: <small>I’m going to take this basic construction of Lebesgue measure for granted going forward, but if you want the formal derivation, you can check out <a href="https://e.math.cornell.edu/people/belk/measuretheory/LebesgueMeasure.pdf">this set of notes</a>. Roughly speaking, Lebesgue measure is constructed by first defining the *outer measure* of a set as the infimum of the total lengths of countable interval covers, and then restricting to the sets for which this notion of size behaves additively. For example, the interval $$[0,1]$$ can be covered by intervals like $$(-\varepsilon,1+\varepsilon)$$ for any $$\varepsilon > 0$$, whose lengths are $$1+2\varepsilon$$. Taking the infimum over all such covers gives Lebesgue measure $$1$$.</small>
[^3]: <small>As I've learned, the Radon-Nikodym theorem comes up a lot in theoretical RL settings, particularly for its role in information theory and bandit algorithms, which you can read about <a href="https://tor-lattimore.com/downloads/book/book.pdf">in this textbook</a>. (I should probably mention I don't even like this textbook very much, but if I had to suffer through it, so do you.)</small>