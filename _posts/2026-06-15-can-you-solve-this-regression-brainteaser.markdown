---
layout: post
title:  "Can You Solve This Regression Brainteaser? (Training Camp)"
subtitle: "Interpreting a non-obvious regression coefficient"
date:   2026-06-15 00:00:00 -0500
categories: jekyll update
---

One of my <a href="https://x.com/Josh_Merfeld/status/1773278105114644577">favorite regression brainteasers</a> of all time comes courtesy of economist <a href="https://joshmerfeld.github.io/">Josh Merfeld</a>.

<img src="/assets/article_images/2026-06-15-images/brainteaser.png" alt="A regression coefficient brainteaser by Josh Merfeld">

In my previous linear models post, I had a section on <a href="https://arnavg.github.io/jekyll/update/2026/06/08/regression-is-all-you-need.html#part-2-interpreting-ols-coefficients">interpreting regression coefficients</a> depending on the model specification (coefficient on a categorical regressor, log-transformed regressors and outcomes, etc.), but each example I used essentially came down to the very basic interpretation of *any* regression coefficient, which is "we expect a $$\hat{\beta}$$ unit change in the $$Y$$ variable for a 1 unit change in the $$X$$ variable."

So what makes this example different? It's tempting to <a href="https://knowyourmeme.com/memes/say-the-line-bart">Say The Line, Bart</a> and give an auto-pilot response of "$$Y$$ changes by $$b$$ units for every one-person increase in household size and $$c$$ units for every additional adult in the household." Unfortunately, this would be incorrect.

To understand why, consider that the household size variable partially depends on the adults variable, both of which are included in the regression. Specifically, the size of a household is the sum total of the number of adults in the household and the number of children in the household.

When we consider households without children, the regression specification becomes something like

$$Y = a + b + c$$ for a single-adult household, and

$$Y = a + b \cdot 2 + c \cdot 2$$ for a two-adult household. In a frat-house or a society that has accepted polyamory, for an $$n$$-adult adult household without children, the regression will be

$$Y = a + b \cdot n + c \cdot n = a + (b + c)n$$

More generally, this implies that the marginal effect of adding one more adult to a household is actually $$b + c$$, NOT just $$b$$ like a naive interpretation may imply. We can actually re-parameterize the original regression to reflect this fact about the model:

$$Y = a + b \cdot \text{Household Size} + c \cdot \text{Adults} = a + b \cdot (\text{Adults + Children}) + c \cdot \text{Adults}$$

$$\therefore Y = a + (b + c) \cdot \text{Adults} + b \cdot \text{Children}$$

From this, we can actually see that $$b$$ is the marginal effect of *one more child* in the household rather than the marginal effect of one more adult like we may have originally surmised. To see an example of this, consider a household size of three with two adults (and therefore one child):

$$Y = a + b \cdot \text{Household Size} + c \cdot \text{Adults} = a + b \cdot 3 + c \cdot 2$$

If we compare this to the regression of the two-adult household with zero children...

$$Y = a + b \cdot 2 + c \cdot 2$$

...we can clearly see that the presence of the child has changed $$Y$$ by an additional $$b$$ units (going from $$2b$$ to $$3b$$), whereas adding an extra adult to the household would have changed $$Y$$ by $$b + c$$ units.

Now what do we do about the interpretation of $$c$$? This is a bit trickier, but if we look at the original regression

$$Y = a + b \cdot \text{Household Size} + c \cdot \text{Adults}$$

we can see that the only way $$c$$ can have any marginal effect on the outcome $$Y$$ is if we can somehow increase the number of adults in the household without increasing the size of the household. More specifically, interpreting $$c$$ relies on us putting the two pieces of information we currently have together:

1. We know the marginal effect of adding one more adult to the household is $$b + c$$
2. We know the marginal effect of adding one more child to the household is $$b$$

Therefore, $$c$$ represents the marginal effect of "exchanging" one child in the household for one adult. In practice, that would probably look less like a strange prisoner-swapping ploy where a child is traded on the black market for some other adult, and probably looks more like a child turning 18 and entering adulthood.

We can further confirm this via simulation:

{% highlight python %}
# imports
import numpy as np
import statsmodels.api as sm

# DGP setup

np.random.seed(61526)

adults = np.random.poisson(lam=2, size=1000) # assuming 2 adults per household
children = np.random.poisson(lam=1.5, size=1000) # assuming 1.5 children per household
hh_size = adults + children
{% endhighlight %}

When we run the first regression `Y ~ 1 + hh_size + adults`, we obtain the following regression table:

{% highlight python %}
X1 = np.vstack([np.ones(1000), hh_size, adults]).T

# Toy DGP
Y = 10 + 5 * adults + 2 * children + np.random.normal(loc=0, scale=2, size=1000)

ols_1 = sm.OLS(Y, X1).fit()
print(ols_1.summary())
{% endhighlight %}

<table class="regression-table">
  <thead>
    <tr><th colspan="7">OLS Regression Results — <code>Y ~ 1 + hh_size + adults</code></th></tr>
    <tr>
      <th>Variable</th><th>Coef</th><th>Std Err</th>
      <th><em>t</em></th><th>P&gt;|t|</th><th>[0.025</th><th>0.975]</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><b>const</b></td><td>9.7770</td><td>0.136</td><td>71.844</td><td>0.000</td><td>9.510</td><td>10.044</td></tr>
    <tr><td><b>hh_size</b></td><td>2.0735</td><td>0.053</td><td>39.434</td><td>0.000</td><td>1.970</td><td>2.177</td></tr>
    <tr><td><b>adults</b></td><td>2.9359</td><td>0.071</td><td>41.498</td><td>0.000</td><td>2.797</td><td>3.075</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="7">N = 1,000 &nbsp;|&nbsp; R² = 0.936 &nbsp;|&nbsp; Adj. R² = 0.936 &nbsp;|&nbsp; F = 7,266 (p = 0.00)</td></tr>
  </tfoot>
</table>

If we ran `Y ~ 1 + adults + children` instead, however, we should expect the coefficient on `children` in this regression to be equal to the coefficient on `hh_size` in the first regression; similarly, we should expect the coefficient on `adults` in this regression to equal the sum of the coefficients in the first regression.

{% highlight python %}
X2 = np.vstack([np.ones(1000), adults, children]).T

ols_2 = sm.OLS(Y, X2).fit()
print(ols_2.summary())
{% endhighlight %}

<table class="regression-table">
  <thead>
    <tr><th colspan="7">OLS Regression Results — <code>Y ~ 1 + adults + children</code></th></tr>
    <tr>
      <th>Variable</th><th>Coef</th><th>Std Err</th>
      <th><em>t</em></th><th>P&gt;|t|</th><th>[0.025</th><th>0.975]</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><b>const</b></td><td>9.7770</td><td>0.136</td><td>71.844</td><td>0.000</td><td>9.510</td><td>10.044</td></tr>
    <tr><td><b>adults</b></td><td>5.0094</td><td>0.045</td><td>111.821</td><td>0.000</td><td>4.922</td><td>5.097</td></tr>
    <tr><td><b>children</b></td><td>2.0735</td><td>0.053</td><td>39.434</td><td>0.000</td><td>1.970</td><td>2.177</td></tr>
  </tbody>
  <tfoot>
    <tr><td colspan="7">N = 1,000 &nbsp;|&nbsp; R² = 0.936 &nbsp;|&nbsp; Adj. R² = 0.936 &nbsp;|&nbsp; F = 7,266 (p = 0.00)</td></tr>
  </tfoot>
</table>

And that's exactly what we obtained! The coefficient on `children` in the second regression is exactly equal to the coefficient on `hh_size` in the first regression, and the coefficient on `adults` in the second regression is equal to the sum of the coefficients on `hh_size` and `adults` in the first regression ($$5.0094 = 2.0735 + 2.9359$$).