---
layout: post
title:  "The ryxcommar Challenge: Can You Answer These Tricky Data Science Interview Questions?"
subtitle: "And some perspectives on \"fair\" data science interviews"
date:   2025-07-09 00:40:26 -0700
categories: jekyll update
---

**Table of contents:**
[Question 1](#question-1) | [Question 2](#question-2) | [Question 3](#question-3) | [Are These Questions Fair?](#are-these-questions-fair)

A little over two years ago, <a href="https://x.com/ryxcommar">ryxcommar</a>, one of my favorite online data science personalities, <a href="https://ryxcommar.com/2023/06/26/should-you-ask-data-science-job-candidates-this-tricky-math-question/">published three tricky data science interview questions related to linear models.</a> They were published as part of larger discourse related to an interview question posed by Twitter user <a href="https://x.com/quantian1/status/1673358773178585091">Quantian1</a>, on whether it's even fair to ask these types of "math-y questions" on a data science interview. (Go read ryxcommar's post on the subject – as he points out, it's not necessarily about whether it's right or wrong to ask these questions in a data science interview, it's about whether you should be hiring a data scientist at all.)

When I first read the blogpost two years ago, I will fully admit that I did not know how to solve any of the questions listed. Part of it may just be because I was a mathematically immature second-year student who had just taken his first probability and statistics classes, but really, it was because I didn't actually understand the things that were taught in those classes (at the time).

It's been two years, and I've taken some pretty tough statistics classes since 2023, including a graduate course on linear models, so I thought it might be a fun challenge to revisit some of these old problems and see how I'd fare if this were an actual data science interview given to me. Before you read my solutions, feel free to try them out yourself:

1. Given $$ Y_t = a_0 + a_1 Z_t + \epsilon_{Y,t} $$ and $$ X_t = b_0 + b_1 Z_t + \epsilon_{X,t}$$ with $$\epsilon_{Y,t}$$ and $$\epsilon{X,t}$$ both being *i.i.d.* Gaussian white noise, calculate the OLS coefficients of $$Y_t = c_0 + c_1 X_t + \omega_t$$ (where $$\omega_t$$ is also *i.i.d.* Gaussian white noise).
2. Given some linear model $$y = \beta_0 + \beta_{x_1} x_1 + \beta_{x_2} x_2 + \epsilon$$, calculate the multiple regression OLS coefficients $$\beta_{x_1}$$ and $$\beta_{x_2}$$ using only simple univariate regressions and simple matrix arithmetic.
3. Given some linear model $$y = \beta_0 + \beta_{x} x + \epsilon$$ with $$\epsilon \sim N(0, 1^2)$$, calculate the OLS coefficients and residual mean + stdev by adding $$\omega \sim N(0, 2^2)$$ to the left hand side $$y$$. ($$\epsilon$$ and $$\omega$$ are uncorrelated.) Now do this exercise again, but instead of adding $$\omega$$ to $$y$$, add it to $$x$$ instead.

My attempted solutions are below. My rules for the challenge were I'd try to do these on raw pen and paper with no AI assistance whatsoever. (I also tried to hold myself to 0 Google searches, but as you will read, I did have to make a couple of references.) Since I did not consult any external resources on this (my minimal Google searches notwithstanding), I actually have no idea if my answers are correct. I ran a couple of simulations as a sanity check, but if you attempt the problems and find any errors I've made, please let me know and I will issue a correction!

**Feel free to skip all my math derivations to the ["Are These Questions Fair?"](#are-these-questions-fair) section, as well.**

## Question 1

To calculate the OLS coefficients of $$Y_t = c_0 + c_1 X_t + \omega_t$$, we can simply start with the definition of $$\hat{c_1}$$ in the case of simple linear regression:

$$\hat{c_1} = \frac{Cov(X_t, Y_t)}{var(X_t)}$$

Since we have models for both $$X_t$$ and $$Y_t$$ in terms of $$Z_t$$, we can substitute those expressions into the numerator and denominator:

$$\frac{Cov(b_0 + b_1 Z_t + \epsilon_{X,t}, a_0 + a_1 Z_t + \epsilon_{Y,t})}{var(b_0 + b_1 Z_t + \epsilon_{X,t})}$$

We'll start by expanding the numerator using linearity of covariance:

$$\text{Numerator: } Cov(b_0, a_0) + Cov(b_0, a_1 Z_t) + Cov(b_0, \epsilon_{Y,t}) $$

$$ + Cov(b_1 Z_t, a_0) + Cov(b_1 Z_t, a_1 Z_t) + Cov(b_1 Z_t, \epsilon_{Y,t}) $$

$$+ Cov(\epsilon_{X,t}, a_0) + Cov(\epsilon_{X,t}, a_1 Z_t) + Cov(\epsilon_{X,t}, \epsilon_{Y,t})$$

This expression looks cumbersome, but it's simpler than it looks. We treat parameters like $$a_0, b_0$$ as fixed constants, so their covariances with any other random variables (or constants) is just 0. Additionally, we know that $$\epsilon_{X_t}, \epsilon_{Y_t}$$ are *i.i.d.* Gaussian white noise sequences, and are therefore uncorrelated with one another and with $$X_t, Y_t$$. Their covariances also 0 out and we are left with:

$$\text{Numerator: } Cov(b_0, a_1 Z_t) + Cov(b_1 Z_t, a_0) + Cov(b_1 Z_t, a_1 Z_t)$$

Again applying linearity of covariance:

$$\text{Numerator: } a_1 Cov(b_0, Z_t) + b_1 Cov(Z_t, a_0) + a_1 b_1 Cov(Z_t, Z_t)$$

$$= a_1 b_1 var(Z_t)$$

Now for the denominator:

$$\text{Denominator: } var(b_0 + b_1 Z_t + \epsilon_{X,t}) = var(b_1 Z_t) + var(\epsilon_{X,t}) + 2Cov(b_1 Z_t, \epsilon_{X,t}) $$

$$= b_1^2 var(Z_t) + var(\epsilon_{X,t})$$

So, we get the OLS coefficient $$\hat{c_1} = \frac{a_1 b_1 var(Z_t)}{b_1^2 var(Z_t) + var(\epsilon_{X,t})}$$

Now to solve for $$\hat{c_0}$$, we can use our expression for the slope estimate:

$$\hat{c_0} = \mathbb{E}[Y_t] - \hat{c_1} \mathbb{E}[X_t]$$

$$= \mathbb{E}[a_0 + a_1 Z_t + \epsilon_{Y,t}] - \hat{c_1} \mathbb{E}[b_0 + b_1 Z_t + \epsilon_{X,t}]$$

$$= a_0 + a_1 \mathbb{E}[Z_t] - \hat{c_1} b_0 - \hat{c_1} b_1 \mathbb{E}[Z_t]$$

$$= (a_0  - \hat{c_1} b_0) + (a_1 - \hat{c_1} b_1) \mathbb{E}[Z_t]$$

I confirm my results via simulation:

{% highlight python %}
import numpy as np
import statsmodels.api as sm

# Setup: n = 1 million, parameters, true models

np.random.seed(42)
n_samples = 1_000_000

a_0 = 5.6
a_1 = 6.4
e_y = np.random.normal(0, 1, n_samples)

b_0 = 4.4
b_1 = 3.1
e_x = np.random.normal(0, 1, n_samples)

Z_t = 0.8 * np.random.normal(0, 15, n_samples) + 0.2 * np.random.uniform(-5, 5, n_samples)

Y_t = a_0 + a_1 * Z_t + e_y
X_t = b_0 + b_1 * Z_t + e_x

# OLS: Estimate coefficients of Y ~ X

X_with_constant = sm.add_constant(X_t)
model = sm.OLS(Y_t, X_with_constant)
results = model.fit()
c_0_estimated = results.params[0]  # Intercept
c_1_estimated = results.params[1]  # Slope coefficient
print(f"Estimated c_0: {c_0_estimated:}") # Estimated c_0: -3.477905708961254
print(f"Estimated c_1: {c_1_estimated:}") # Estimated c_1: 2.0629130378027924

# My analytical solutions

c_1_theoretical = (a_1 * b_1 * np.var(Z_t)) / (b_1 ** 2 * np.var(Z_t) + 1)
c_0_theoretical = (a_0 - c_1_theoretical * b_0) + (a_1 - c_1_theoretical * b_1) * np.mean(Z_t)
print(f"Theoretical c_0: {c_0_theoretical:}") # Theoretical c_0: -3.477314407021521
print(f"Theoretical c_1: {c_1_theoretical:}") # Theoretical c_1: 2.063028027692611
{% endhighlight %}

## Question 2

Question 2 screams <a href="https://en.wikipedia.org/wiki/Frisch%E2%80%93Waugh%E2%80%93Lovell_theorem">Frisch-Waugh-Lovell (FWL) theorem</a>. In plain English, for linear model $$y = \beta_1 x_1 + \beta_2 x_2 + \epsilon$$, the theorem states that if you regress $$y \sim x_1$$, then regress $$x_2 \sim x_1$$, and finally regress the residuals of each of those regressions on each other $$\widehat{\epsilon_{y \sim x_1}} \sim \widehat{\epsilon_{x_2 \sim x_1}}$$, the coefficient of $$x_2$$ in that last "residual" regression would be the same coefficient as $$\beta_2$$ in the original regression.

If you want a good explainer and visual intuition for why this is true, ryxcommar wrote a <a href="https://ryxcommar.com/2020/12/26/frisch-waugh-lovell-theorem-animated/">blogpost on it</a> a few years ago.

On a personal note, I had to quote the FWL theorem on my linear models midterm exam:

![Exam FWL Theorem](/assets/article_images/2025-07-03-images/fwl_exam.png "Exam FWL Theorem")
![Arnav quotes a HUGE theorem to bring his midterm score to the class average](/assets/article_images/2025-07-03-images/cp3_fwl_meme.png "Arnav quotes a HUGE theorem to bring his midterm score to the class average")

Anyways, onto the problem. I don't think simply quoting the FWL theorem for this question would be sufficient on the interview so I will do the regression algebra by hand.

For this problem, I'm going to assume that $$x_1$$ and $$x_2$$ are centered (the mean is subtracted from each element such that $$\bar{x_1} = \bar{x_2} = 0$$), which allows me to ignore the intercept term without altering the other coefficients. This is not an essential assumption to make since I could just treat the regression as $$y = \beta_1 X_1 + \beta_2 x_2 + \epsilon$$ where $$X_1 = \begin{bmatrix} 1 & x_1 \\ \vdots & \vdots \\ 1 & x_n \\ \end{bmatrix} \in \mathbb{R}^{n \times 2}$$, but it'll make the notation/linear algebra a little cleaner and easier.

So our model is $$y = \beta_1 x_1 + \beta_2 x_2 + \epsilon$$.

We first run the regression for the model $$y = \beta_1 x_1 + \epsilon$$

This gives us the residual $$\hat{\epsilon_1} = y - x_1 \hat{\beta_1}$$, where $$\hat{\beta_1} = (x_1^T x_1)^{-1} x_1^T y$$. [^1]

We can factor this such that $$\hat{\epsilon_1} = (I_n - x_1 (x_1^T x_1)^{-1} x_1^T)y$$

Next, we'll run the regression for the model $$x_2 = \gamma_1 x_1 + \epsilon$$

We obtain the residual $$\hat{\epsilon_2} = x_2 - x_1 \hat{\gamma_1}$$, where $$\hat{\gamma_1} = (x_1^T x_1)^{-1} x_1^T x_2$$.

We can factor this such that $$\hat{\epsilon_2} = (I_n - x_1 (x_1^T x_1)^{-1} x_1^T)x_2$$

Lastly, we regress $$\hat{\epsilon_1} \sim \hat{\epsilon_2} \implies (I_n - x_1 (x_1^T x_1)^{-1} x_1^T)y = \beta_{2 FWL} (I_n - x_1 (x_1^T x_1)^{-1} x_1^T)x_2 + \omega$$

To keep the notation more compact, I'm going to use the hat matrix $$H_1 = x_1 (x_1^T x_1)^{-1} x_1^T$$. (See Question 3 where I expand upon this.)

Now, the OLS coefficient in this regression would be:

$$\widehat{\beta_{2 FWL}} = ([(I_n - H_1)x_2]^T[(I_n - H_1)x_2])^{-1}([(I_n - H_1)x_2]^T(I_n - H_1)y)$$

$$ = (x_2^T(I_n - H_1)^T[(I_n - H_1)x_2])^{-1}(x_2^T(I_n - H_1)^T(I_n - H_1)y)$$

$$(I_n - H_1)$$ is a projection matrix which means it is symmetric and idempotent: $$(I_n - H_1)^T = (I_n - H_1)^2 = (I_n - H_1)$$

$$ = (x_2^T(I_n - H_1)^2 x_2)^{-1}(x_2^T(I_n - H_1)^2y)$$

$$ = (x_2^T(I_n - H_1) x_2)^{-1}(x_2^T(I_n - H_1)y)$$

And in fact, we're done now! This equals the coefficient from the long regression $$\hat{\beta_2}$$. On the interview, I might just leave it at that, but I'll more rigorously prove that this is true, for the fans.

We'll substitute $$H_1 = x_1 (x_1^T x_1)^{-1} x_1^T$$ back into the equation:

$$ = (x_2^T(I_n - x_1 (x_1^T x_1)^{-1} x_1^T) x_2)^{-1}(x_2^T(I_n - x_1 (x_1^T x_1)^{-1} x_1^T)y)$$

$$ = (x_2^T x_2 - x_2^T x_1 (x_1^T x_1)^{-1} x_1^T x_2)^{-1}(x_2^T y - x_2^T x_1 (x_1^T x_1)^{-1} x_1^Ty)$$

Note that all these inner products are scalars, which means that $$(x_1^T x_1)^{-1}$$ is simply equal to $$\frac{1}{(x_1^T x_1)}$$.

$$ = \left(x_2^T x_2 - \frac{x_2^T x_1 x_1^T x_2}{(x_1^T x_1)}\right)^{-1}\left(x_2^T y - \frac{x_2^T x_1 x_1^Ty}{(x_1^T x_1)}\right)$$

$$ = \left(\frac{(x_2^T x_2)(x_1^T x_1) - x_2^T x_1 x_1^T x_2}{(x_1^T x_1)}\right)^{-1}\left(\frac{(x_2^T y)(x_1^T x_1) - x_2^T x_1 x_1^Ty}{(x_1^T x_1)}\right)$$

The numerator in the first term is just a difference between two scalars, making the entire expression a quotient of two scalars, so its inverse is just the reciprocal of that expression.

$$ = \left(\frac{(x_1^T x_1)}{(x_2^T x_2)(x_1^T x_1) - x_2^T x_1 x_1^T x_2}\right)\left(\frac{(x_2^T y)(x_1^T x_1) - x_2^T x_1 x_1^Ty}{(x_1^T x_1)}\right)$$

One convenient cancellation later, and we're left with:

$$\widehat{\beta_{2 FWL}} = \frac{(x_2^T y)(x_1^T x_1) - x_2^T x_1 x_1^Ty}{(x_2^T x_2)(x_1^T x_1) - x_2^T x_1 x_1^T x_2}$$

I'll now prove that this expression is equivalent to the OLS solution for $$\hat{\beta_2}$$.

We start with $$\begin{bmatrix} \hat{\beta_1} \\ \hat{\beta_2} \end{bmatrix} = \left(\begin{bmatrix} x_1 & x_2 \end{bmatrix}^T \begin{bmatrix} x_1 & x_2 \end{bmatrix}\right)^{-1} \begin{bmatrix} x_1 & x_2 \end{bmatrix}^T y$$

$$ = \left(\begin{bmatrix} x_1^T \\ x_2^T \end{bmatrix} \begin{bmatrix} x_1 & x_2 \end{bmatrix}\right)^{-1} \begin{bmatrix} x_1^T \\ x_2^T \end{bmatrix} y$$

$$ = \left(\begin{bmatrix} x_1^T x_1 && x_1^T x_2 \\ x_2^T x_1 && x_2^T x_2\end{bmatrix}\right)^{-1} \begin{bmatrix} x_1^T y \\ x_2^T y \end{bmatrix}$$

$$ = \frac{1}{(x_1^T x_1)(x_2^T x_2) - (x_1^T x_2)(x_2^T x_1)} \left(\begin{bmatrix} x_2^T x_2 && -x_1^T x_2 \\ -x_2^T x_1 && x_1^T x_1\end{bmatrix}\right) \begin{bmatrix} x_1^T y \\ x_2^T y \end{bmatrix}$$

This matrix-vector product yields a vector $$\in \mathbb{R}^{2}$$, of which the second element equals the coefficient $$\hat{\beta_2}$$. So, we only need to concern ourselves with the second inner product in this computation:

$$\hat{\beta_2} = \frac{-(x_2^T x_1)(x_1^T y) + (x_1^T x_1)(x_2^T y)}{(x_1^T x_1)(x_2^T x_2) - (x_1^T x_2)(x_2^T x_1)}$$

And after rearranging some terms in the numerator, we find that this is exactly equal to our estimated coefficient $$\widehat{\beta_{2 FWL}}$$. Yay!

The computation for $$\hat{\beta_1} = \widehat{\beta_{1 FWL}}$$ is essentially identical to this one. Regress $$y \sim x_2$$, then $$x_1 \sim x_2$$, then regress the residuals from each of those regressions onto each other. We should be left with:

$$\widehat{\beta_{1 FWL}} = (x_1^T(I_n - H_2) x_1)^{-1}(x_1^T(I_n - H_2)y)$$

I confirm my solution via simulation.

{% highlight python %}
import numpy as np
import statsmodels.api as sm

# Setup: n = 50 thousand, parameters, true models

np.random.seed(42)
n_samples = 50_000

x_1_uncentered = np.random.normal(50, 10, n_samples)
x_2_uncentered = np.random.normal(45, 5, n_samples)
x_1 = x_1_uncentered - np.mean(x_1_uncentered)
x_2 = x_2_uncentered - np.mean(x_2_uncentered)
e = np.random.normal(0, 1, n_samples)

b_1 = 17
b_2 = 38

y = b_1 * x_1 + b_2 * x_2 + e

# Calculate OLS coefficients

model = sm.OLS(y, np.array([x_1, x_2]).T)
results = model.fit()
b_1_estimated = results.params[0]
b_2_estimated = results.params[1]
print(f"Estimated b_1: {b_1_estimated:}") # Estimated b_1: 17.00028558829424
print(f"Estimated b_2: {b_2_estimated:}") # Estimated b_2: 38.000974544359096

# Manual FWL - b_2
model_1_b2 = sm.OLS(y, x_1)
results_1_b2 = model_1_b2.fit()
y_hat = results_1_b2.predict(x_1)
residuals_1_b2 = y - y_hat

model_2_b2 = sm.OLS(x_2, x_1)
results_2_b2 = model_2_b2.fit()
x_2_hat = results_2_b2.predict(x_1)
residuals_2_b2 = x_2 - x_2_hat

model_fwl_b2 = sm.OLS(residuals_1_b2, residuals_2_b2)
results_fwl_b2 = model_fwl_b2.fit()
b2_fwl = results_fwl_b2.params[0]
print(f"FWL Coefficient (b_2): {b2_fwl:}") # FWL Coefficient (b_2): 38.000974544359494

# Sanity check - analytical solution
b2_fwl_analytical_numerator = np.dot(x_2.T, y) * np.dot(x_1.T, x_1) - np.dot(x_2.T, x_1) * np.dot(x_1.T, y)
b2_fwl_analytical_denominator = np.dot(x_2.T, x_2) * np.dot(x_1.T, x_1) - np.dot(x_2.T, x_1) * np.dot(x_1.T, x_2)
b2_fwl_analytical = b2_fwl_analytical_numerator / b2_fwl_analytical_denominator
print(f"FWL Coefficient (b_2 - Analytical Solution): {b2_fwl_analytical}") # FWL Coefficient (b_2 - Analytical Solution): 38.00097454435913

# Manual FWL - b_1
model_1_b1 = sm.OLS(y, x_2)
results_1_b1 = model_1_b1.fit()
y_hat = results_1_b1.predict(x_2)
residuals_1_b1 = y - y_hat

model_2_b1 = sm.OLS(x_1, x_2)
results_2_b1 = model_2_b1.fit()
x_1_hat = results_2_b1.predict(x_2)
residuals_2_b1 = x_1 - x_1_hat

model_fwl_b1 = sm.OLS(residuals_1_b1, residuals_2_b1)
results_fwl_b1 = model_fwl_b1.fit()
b1_fwl = results_fwl_b1.params[0]
print(f"FWL Coefficient (b_1): {b1_fwl:}") # FWL Coefficient (b_1): 17.00028558829454

# Sanity check - analytical solution
b1_fwl_analytical_numerator = np.dot(x_1.T, y) * np.dot(x_2.T, x_2) - np.dot(x_1.T, x_2) * np.dot(x_2.T, y)
b1_fwl_analytical_denominator = np.dot(x_1.T, x_1) * np.dot(x_2.T, x_2) - np.dot(x_1.T, x_2) * np.dot(x_2.T, x_1)
b1_fwl_analytical = b1_fwl_analytical_numerator / b1_fwl_analytical_denominator
print(f"FWL Coefficient (b_1 - Analytical Solution): {b1_fwl_analytical}") # FWL Coefficient (b_1 - Analytical Solution): 17.00028558829437
{% endhighlight %}

## Question 3

### (1) Adding noise to $$y$$

We'll first start with the part of the question where we change the linear model to:

$$y' = y + \omega = \beta_0 + \beta_{x} x + \epsilon + \omega$$ where $$\omega \sim N(0, 2^2)$$ and is independent of $$\epsilon$$.

This question is almost trivial, and in fact, is actually a famous result: <a href="https://econ.lse.ac.uk/staff/spischke/ec524/Merr_new.pdf">measurement error</a> in the dependent variable. Everything should be unchanged from the previous model's estimates – except the distribution of the error term, which is now:

$$\epsilon + \omega \sim N(0 + 0, 1^2 + 2^2) \implies \epsilon + \omega \sim N(0, (\sqrt{5})^2)$$.

However, since I hate myself, I'll try to prove my claims above more rigorously.

Given the linear model for $$y'$$, $$\hat{\beta_x} = \frac{Cov(x, y + \omega)}{var(x)}$$, which is the definition of the estimate of the slope coefficient in OLS.

Using properties of covariance we get:

$$ \hat{\beta_x} = \frac{Cov(x, y) + Cov(x, \omega)}{var(x)}$$

Technically, we're done, if we make no further assumptions about the error term $$\omega$$. However, I believe the standard result that this problem is attempting to show relies on the assumption that $$\omega$$ is also independent of the regressor $$x$$ (which is also a standard assumption in linear regression). Also, based on the given data generating process of $$\omega$$, I see no reason why information about $$\omega$$ should convey information about $$x$$, and vice versa.  If we assume that $$\omega$$ is independent of $$x$$, then their covariance is 0 and the expression reduces to:

$$ \hat{\beta_x} = \frac{Cov(x, y)}{var(x)}$$

which is exactly what the OLS estimate of the slope coefficient was before adding Gaussian white noise to $$y$$. Similarly, for the OLS estimate of the intercept:

$$\hat{\beta_0} = \mathbb{E}[y + \omega] - \hat{\beta_x} \mathbb{E}[x]$$

$$= \mathbb{E}[y] + \mathbb{E}[\omega] - \hat{\beta_x} \mathbb{E}[x]$$

$$= \mathbb{E}[y] - \hat{\beta_x} \mathbb{E}[x] (\text{since } \omega \text{ is normal with expectation } 0)$$

Since $$\hat{\beta_x}$$ is unchanged whether or not we add the Gaussian white noise term $$\omega$$, $$\hat{\beta_0}$$ is also unchanged, and we are left with the same model specification that we would have had before noising the outcome variable. This result shows us that adding Gaussian white noise to the outcome variable $$y$$ does not change the OLS estimates of the model parameters.

Now for the distribution of the residuals. Off rip, a property of OLS is that the residuals always must sum to 0, so by construction, **we know that the residuals have expectation 0**. Still, we can verify this. 

We start with the definition of the residuals. For simplicity, I'm going to write everything in matrix notation (yes, believe it or not that makes it simpler). I will use $$X \in \mathbb{R}^{n \times 2}$$ to refer to our regressors – a column of $$1$$s (for the intercept), and a column of our data $$x$$. Recall that $$y'$$ refers to $$y + \omega$$. So we define residuals as:

$$\hat{\epsilon} = y' - \hat{y'}$$.

Before I proceed, I will own up to the fact that I did reference my old <a href="https://arxiv.org/pdf/2401.00649">linear models textbook</a> from Prof. Peng Ding's <a href="https://classes.berkeley.edu/content/2024-spring-stat-230a-001-lec-001">Stat 230A class</a> at Berkeley for the following proofs. The reason being ... I just kind of forgot the exact derivations and wanted to complete the exercise. So, again, if this is grounds to flunk me from the interview, by all means, I'll continue my job search elsewhere.

Anyways, I'm going to use a slight trick here that I learned from the textbook. We know that $$\hat{y'} = X \hat{\beta}$$, where $$\hat{\beta} = \begin{bmatrix} \hat{\beta_0} \\ \hat{\beta_x} \\ \end{bmatrix}$$. We also know that the OLS estimate for $$\hat{\beta}$$ is $$(X^TX)^{-1}X^Ty'$$ (assuming $$X^TX$$ is invertible, of course).

So, $$\hat{\epsilon} = y' - X \hat{\beta} = y' - X(X^TX)^{-1}X^Ty'$$.

Furthermore, we will define the "hat" matrix $$H \in \mathbb{R}^{n \times n}$$ as $$X(X^TX)^{-1}X^T$$, which is actually a projection matrix onto the column space of $$X$$. (It's called a "hat" matrix because when applied to $$y'$$, it gives the projection of $$y'$$ onto $$Col(X)$$, which produces $$\hat{y'}$$.)

That means that $$\hat{\epsilon} = y' - Hy'$$.

We can factor this as $$\hat{\epsilon} = (I_n - H)y'$$. Incidentally, $$I_n - H$$ is also a projection matrix (onto the complement of $$Col(X)$$).

First, we'll prove that the residuals have expectation 0:

$$\mathbb{E}[\hat{\epsilon}] = \mathbb{E}[(I_n - H)y']$$

Recall that $$y' = y + \omega = X \beta + \epsilon + \omega$$. Under the Gauss-Markov assumptions, $$X$$ is fixed, and $$\beta = \begin{bmatrix} \beta_0 \\ \beta_x \\ \end{bmatrix}$$ are just some numbers (fixed population parameters ... sorry, Bayesians). That leaves the only random part of this expression as the error term, $$\epsilon + \omega$$, which has mean 0.

$$\therefore \mathbb{E}[y'] = \mathbb{E}[ X \beta + \epsilon + \omega] = X \beta$$

Thus, $$\mathbb{E}[\hat{\epsilon}] = (I_n - H)\mathbb{E}[y'] = (I_n - H)X \beta$$

$$= X \beta - HX \beta$$

Intuitively, $$HX$$ is the projection of $$X$$ onto its own column space, which is also just $$X$$. We can verify this algebraically: $$HX = X(X^TX)^{-1}X^TX = X$$ since $$(X^TX)^{-1}X^TX = I_2$$.

So, $$\mathbb{E}[\hat{\epsilon}] = X \beta - X \beta = 0$$.

This is definitely overkill for something we know to be true by construction of OLS, but I thought it might be good to be more rigorous for the sake of the exercise (definitely would not do this on the actual interview given time constraints).

Now, this problem phrasing is very annoying. If it had said calculate the distribution of the new error term, this amounts to just adding two normal distributions under the Gauss-Markov assumptions, and we would get $$\epsilon + \omega \sim N(0, (\sqrt{5})^2)$$ as we found earlier. However, the question asks for the variance of the *residuals*, which are different than the error term itself.

Luckily, with our matrix notation, we can compute the covariance matrix of the residuals directly:

$$Cov(\hat{\epsilon}) = Cov[(I_n - H)y']$$

$$= (I_n - H) Cov(y') (I_n - H)^T$$

Under the Gauss-Markov assumptions, $$Cov(y') = \sigma'^2 I_n$$, where $$\sigma'^2$$ is the variance of the error term after adding $$\omega$$ to $$y$$ in the original model. In this case, we know $$\sigma'^2$$ to be $$(\sqrt{5})^2$$ (sum of two normal distributions as we found above).

A convenient property of projection matrices (e.g., $$H$$) is that they must satisfy $$H^T = H$$ and $$H^2 = H$$ (symmetric and idempotent). So, $$(I_n - H)^T = (I_n - H)$$, and $$(I_n - H)^2 = (I_n - H)$$.

Thus, we are left with:

$$Cov(\hat{\epsilon}) = (\sqrt{5})^2 (I_n - H)^2 = (\sqrt{5})^2 (I_n - H)$$.

As such, the covariance matrix of the new residuals is the variance of the new error term $$(\sqrt{5})^2$$ times the projection matrix onto the complement of the column space of $$X$$. So, for each individual residual $$\hat{\epsilon_i}$$, we can write the variance as $$var[\hat{\epsilon_i}] = (\sqrt{5})^2 (1 - h_{ii})$$, where $$h_{ii}$$ are the corresponding diagonal elements of $$H$$.

I confirm my results via simulation:

{% highlight python %}
import numpy as np
from numpy.linalg import inv
import statsmodels.api as sm

# Setup: n = 50 thousand, parameters, true models

np.random.seed(42)
n_samples = 50_000
b_0 = 4.13
b_1 = 3.14
e = np.random.normal(0, 1, n_samples)
w = np.random.normal(0, 2, n_samples)

x = np.random.normal(100, 15, n_samples)
y = b_0 + b_1 * x + e

# First check: coefficients pre-noise
x_with_constant = sm.add_constant(x)
model = sm.OLS(y, x_with_constant)
results = model.fit()
b_0_estimated = results.params[0]  # Intercept
b_1_estimated = results.params[1]  # Slope coefficient
print(f"Estimated b_0: {b_0_estimated:}") # Estimated b_0: 4.110769857103968
print(f"Estimated b_1: {b_1_estimated:}") # Estimated b_1: 3.1401879917723092

# Second check: coefficients post-noise
y_noise = y + w
x_with_constant = sm.add_constant(x)
model = sm.OLS(y_noise, x_with_constant)
results = model.fit()
b_0_estimated = results.params[0]  # Intercept
b_1_estimated = results.params[1]  # Slope coefficient
print(f"Estimated b_0: {b_0_estimated:}") # Estimated b_0: 4.050512810216812 (seems lower but I checked that in larger n_samples it more closely matches)
print(f"Estimated b_1: {b_1_estimated:}") # Estimated b_1: 3.140837307225619

# Residuals
y_noise_hat = results.predict(x_with_constant)
residuals = y_noise - y_noise_hat
print(f"Residual mean: {np.mean(residuals)}") # Residual mean: -5.293429694575025e-14
print(f"Residual std dev:  {np.std(residuals)}") # Residual std dev:  2.231809602041155

# My computation
X = x_with_constant
H = np.dot(X, np.dot(inv(np.dot(X.T, X)), X.T))
std_resid_11 = np.sqrt(np.sqrt(5)**2 * (1 - H[0][0]))
print(f"Standard deviation of e_11: {std_resid_11}") # Standard deviation of e_11: 2.2360220102832478

{% endhighlight %}

### (2) Adding noise to $$x$$

Believe it or not, part (1) was the easier part of this question.

We once again start with linear model $$y = \beta_0 + \beta_x x + \epsilon$$, with $$\epsilon \sim N(0, 1^2)$$

Now we're going to add the new error term $$\omega$$ to $$x$$, which produces the following linear model:

$$y = \beta_0' + \beta_{x}' (x + \omega) + \epsilon$$ where $$\omega \sim N(0, 2^2)$$ and is assumed independent of $$\epsilon$$ and $$x$$.

We calculate the new OLS estimate for $$\beta_x'$$ as such:

$$\hat{\beta_x}' = \frac{Cov(x + \omega, y)}{var(x + \omega)}$$

$$= \frac{Cov(x, y) + Cov(\omega, y)}{var(x) + var(\omega) + 2 Cov(x, \omega)}$$

Like we assumed in the first problem $$x$$ and $$\omega$$ should be independent and therefore uncorrelated, so their covariance is 0.

Ideally, we'd like to express the change in the estimated coefficient of the new model in terms of the parameters of the true, original model. We can substitute the correct model for $$y$$ into the numerator:

$$\frac{Cov(x, \beta_0 + \beta_x x + \epsilon) + Cov(\omega, \beta_0 + \beta_x x + \epsilon)}{var(x) + var(\omega)}$$

We can now use linearity of covariance to expand the numerator:

$$\text{First term: } Cov(x, \beta_0) + Cov(x, \beta_x x) + Cov(x, \epsilon)$$

$$\text{Second term: } Cov(\omega, \beta_0) + Cov(\omega, \beta_x x) + Cov(\omega, \epsilon)$$

Since $$\beta_0, \beta_x$$ are just numbers (again, some fixed parameters), we treat them as constants and they have covariance 0 with any other random variable. Similarly, we previously assumed that $$\epsilon$$, $$\omega$$, and $$x$$ are all independent of each other. So all those terms 0 out and we are left with:

$$\text{First term: } Cov(x, \beta_x x) = \beta_x Cov(x, x) = \beta_x var(x)$$

$$\text{Second term: } \beta_x Cov(\omega, x) = 0$$

That leaves our final OLS estimate of the slope coefficient as:

$$\hat{\beta_x}' = \frac{\beta_x var(x)}{var(x) + var(\omega)} = \beta_x \frac{var(x)}{var(x) + var(w)}$$

Notice that $$var(x) < var(x) + var(w)$$, so when $$\omega$$ is added to $$x$$, the noisier measurement of the regressor biases the OLS slope estimate downward (this is called *attenuation*, and in fact, this problem is meant to illustrate a phenomenon known as <a href="https://en.wikipedia.org/wiki/Regression_dilution">*attenuation bias*</a>).

Now for the intercept term. We can use our slope estimate and substitute into the equation:

$$\beta_0' = \mathbb{E}[y] - \beta_x' \mathbb{E}[x + \omega]$$

$$= \mathbb{E}[y] - \beta_x \frac{var(x)}{var(x) + var(w)}(\mathbb{E}[x] + \mathbb{E}[\omega])$$

$$= \mathbb{E}[y] - \beta_x \frac{var(x)}{var(x) + var(w)}(\mathbb{E}[x])$$

So the intercept is also biased by the attenuation factor from the slope estimate. (However, the intercept itself need not be attenuated, since the bias can go in either direction.)

Lastly, we have the residual mean and standard deviation.

Like before, we know that by construction, $$\mathbb{E}[\hat{\epsilon}] = 0$$. This isn't too difficult to prove either.

Recall that we have two models here:

1. The "true model," where we regress $$y$$ on $$\beta_0 + \beta_x x + \epsilon$$
2. The "noisy model," where we regress (the same) $$y$$ on $$\beta_0' + \beta_x' (x + \omega) + \epsilon$$

We estimate the "noisy model" with $$\hat{y'} = X_{\omega} \hat{\beta'}$$, where

$$X_{\omega} = \begin{bmatrix} 1 & x_1 + \omega \\ \vdots & \vdots \\ 1 & x_n + \omega \\ \end{bmatrix} \in \mathbb{R}^{n \times 2}$$ and $$\hat{\beta'} = \begin{bmatrix} \hat{\beta_0'} \\ \hat{\beta_x'} \\ \end{bmatrix}$$

Furthermore, we know $$\hat{\beta'} = (X_{\omega}^T X_{\omega})^{-1} X_{\omega}^T y$$, assuming $$X_{\omega}$$ is full rank.

Now we proceed much in the same way as we did in part (1).

$$\hat{\epsilon} = y - X_{\omega}(X_{\omega}^T X_{\omega})^{-1} X_{\omega}^T y$$, and we can define hat matrix $$H_{\omega} = X_{\omega}(X_{\omega}^T X_{\omega})^{-1} X_{\omega}^T$$

Then, $$\hat{\epsilon} = y - H_{\omega}y = (I_n - H_{\omega})y$$

From here we can just take expectation and covariance as we did in part (1):

$$\mathbb{E}[\hat{\epsilon}] = (I_n - H_{\omega})\mathbb{E}[y] = (I_n - H_{\omega})X\beta = 0$$

$$Cov(\hat{\epsilon}) = (I_n - H_{\omega}) Cov(y) (I_n - H_{\omega})^T$$

The Gauss-Markov assumptions give us that $$Cov(y) = \sigma^2 I_n$$. Since $$y = \beta_0' + \beta_x' (x + \omega) + \epsilon = \beta_0' + \beta_x' x + \beta_x' \omega + \epsilon$$, under the Gauss-Markov assumptions with fixed $$x$$, we are left with:

$$\sigma^2 = var(y) = var(\beta_x' \omega + \epsilon) = \beta_x'^2 var(\omega) + var(\epsilon) + 2 \beta_x' Cov(\omega, \epsilon)$$

Since $$\epsilon \perp \omega$$, their covariance is 0, and substituting our known values for the variances of the error terms we are left with:

$$\sigma^2 = 2^2 \cdot \beta_x'^2 + 1^2$$

Thus, $$Cov(\hat{\epsilon}) = (2^2 \cdot \beta_x'^2 + 1^2) (I_n - H_{\omega})$$, meaning $$var((\hat{\epsilon_i})) = (2^2 \cdot \beta_x'^2 + 1^2) (1 - h_{ii})$$. (Take the square root to find the standard deviation.)

I confirm my results via simulation.

{% highlight python %}
import numpy as np
from numpy.linalg import inv
import statsmodels.api as sm

# Setup: n = 50 thousand, parameters, true models

np.random.seed(42)
n_samples = 50_000
b_0 = 4.13
b_1 = 3.14
e = np.random.normal(0, 1, n_samples)
w = np.random.normal(0, 2, n_samples)

x = np.random.normal(100, 15, n_samples)
y = b_0 + b_1 * x + e

x_noise = x + w

# First check: OLS y ~ x + w
x_noise_with_constant = sm.add_constant(x_noise)
model = sm.OLS(y, x_noise_with_constant)
results = model.fit()
b_0_estimated = results.params[0]  # Intercept
b_1_estimated = results.params[1]  # Slope coefficient
print(f"Estimated b_0: {b_0_estimated:}") # Estimated b_0: 9.806844003787974
print(f"Estimated b_1: {b_1_estimated:}") # Estimated b_1: 3.083112622460206

# Second check: compare to theoretical results
b_1_theoretical = b_1 * np.var(x) / (np.var(x) + 4)
b_0_theoretical = np.mean(y) - b_1_theoretical * np.mean(x)
print(f"Theoretical b_0: {b_0_theoretical:}") # Theoretical b_0: 9.621914047422138 (small difference due to sampling error I hope T_T)
print(f"Theoretical b_1: {b_1_theoretical:}") # Theoretical b_1: 3.0851060466210867

# Residuals
y_hat = results.predict(x_noise_with_constant)
residuals = y - y_hat
print(f"Residual mean: {np.mean(residuals)}") # Residual mean: -9.30509713725769e-14
print(f"Residual std dev:  {np.std(residuals)}") # Residual std dev:  6.318874966933309

# My computation
X_w = x_noise_with_constant
H_w = np.dot(X_w, np.dot(inv(np.dot(X_w.T, X_w)), X_w.T))
std_resid_11 = np.sqrt((b_1**2 * 2**2 + 1**2) * (1 - H[0][0]))
print(f"Standard deviation of e_11: {std_resid_11}") # Standard deviation of e_11: 6.358988710434451
{% endhighlight %}


## Are These Questions Fair?

From his blogpost, ryxcommar seems to believe that these types of questions are fair game to ask during a data science interview:

> What all of these questions (including Quantian1’s question) have in common is they care about your understanding of variance + covariance, the close form solution for univariate coefficients $$\frac{\textrm{Cov}(x,y)}{\textrm{Var}(x)}$$, and how to add and subtract Gaussian distributions. Things of that nature.

But with all due respect to ryxcommar, I'm going to argue that these questions would probably be unfair on most data science interviews.

And no, I'm not just saying that because I thought the questions were too difficult and could only do 1.5/3 without consulting my linear models textbook. But these questions *are* quite difficult. I personally spent anywhere from 15 minutes to an hour on these questions, and it wasn't even really the statistics concepts that ate up time. I ran out a lot of clock making silly arithmetic or algebra mistakes – forgetting a plus or minus sign, an inverse or a transpose, things of that nature – that really seem orthogonal to my ability to understand the underlying concepts or carry out the proofs. And that was in the comfort of my own home! I'd probably do terribly under time pressure if I had to show up in-person and write these out on a white board.

The thesis of ryxcommar's blog post is that these questions are very difficult by design, and you should expect to filter out 95% of data science candidates with them. But as he argues, that's because any competent data scientist *should* have a basic command of statistics and matrix algebra, and if you as an interviewer feel that these napkin math questions are unrelated to a job that's probably just a lot of SQL dirty work, then you don't really need to be hiring a data scientist.

In principle, I don't disagree. I think a good data scientist should have some familiarity with the concepts in each of the questions – understanding OLS estimation, linear algebra, and statistical inference are all hallmarks of someone whose data science education goes beyond a pandas and sklearn bootcamp.

But I disagree that these specific questions test the "basics" like Quantian's original question did.

I actually think Quantian's question is perfectly crafted, a work of art, even. It's not too cumbersome, elegantly tests out linear algebra knowledge like 2x2 rotation matrices and some basic matrix/vector multiplication, and relies on quick addition of normal distributions and knowing some basic variance/covariance properties.[^2]

I'd say of the three questions today, Question 1 most closely emulated what Quantian's question was trying to do, and I think it was the most fair question/highly accessible to anyone who took a probability class in college.

My main gripe with the other two questions is I'm not sure that *every* data scientist needs to know them.

If the data science job in question is running a bunch of regressions and requires someone to essentially have graduate-level training in linear models, then sure, Questions 2 and 3 are fair game. But a company might not need their data scientist to be a regression expert, or even run that many regressions on the job! Ryxcommar would probably argue that such a role would not be a "data scientist" role, but I think there's a lot of room for data scientist positions between just "SQL monkey" and "regression expert." I've worked with (some very talented!) data science teams that were mostly focused on probabilistic forecasting and predictive modeling, where running regressions was a relatively minor part of the work we were doing. If those teams were interviewing for a data scientist, I think it'd be very fair to ask a prospective hire about basic probability theory, logistic regression, and calibration, but I really don't see why such a candidate would need to be able to quote the Frisch-Waugh-Lovell theorem from memory.

Another gripe I have with the questions is that they're only fair game for a certain type of statistical training, in my opinion. The questions seem like they come straight out of <a href="https://www.mostlyharmlesseconometrics.com/">Mostly Harmless Econometrics</a>, and as such, the underlying "lessons" behind all of them are things you would see in an econometrics class, like omitted variable bias, FWL, attenuation bias, measurement error, and maybe even instrumental variables (depending on how you look at Question 1). As far as I know, ryxcommar has an econ background (his username is literally the Stata command to run a regression), so it makes sense that he'd pull out more econometrics-related questions, but I don't think asking questions that *only* people who have studied econometrics would be able to answer is fair for a data scientist interview. You could argue that a competent data scientist should be able to derive things like FWL from first principles, but I think that's honestly a pretty ridiculous assertion. I know plenty of talented CS/statistics majors at Berkeley who have worked in very prestigious SWE/MLE roles, but I don't expect even the most talented among them to know how to derive FWL from scratch if they'd never seen it before.

Speaking of "lessons" from these questions, I could be wrong, but I think a better use of an interviewer's time would be just sanity checking that an interviewee knows what those underlying lessons are rather than forcing them to do tedious napkin math. Rather than ask them to literally "calculate" the OLS coefficients and residual standard deviation in Question 3, for example, ask them *how* they would think the coefficients and residuals would change as a result of adding measurement noise in $$y$$ or $$x$$. Most people who know what they're talking about would probably be able to quickly identify that adding Gaussian white noise to $$y$$ would change the variance of the error term to $$\sigma^2_{\epsilon} + \sigma^2_{\omega}$$ (which is SO much better than calculating the full variance of the residuals), but the actual OLS coefficients should remain unchanged/unbiased and by construction the residuals will have mean 0. And for adding noise to $$x$$, they should be able to identify that the OLS coefficients will become biased (bonus points if they know attenuation), the residuals will still have mean 0 due to properties of OLS, and the variance will again change by some factor related to the sum of $$\sigma^2_{\epsilon} + \beta_x' \sigma^2_{\omega}$$.

Another fun modification if this were to be a data science interview could be to ask a question like Question 1 to test out their probability and statistics chops, then make them code up the solution to something like Question 2 in numpy. You could then ask them some of the following questions that Prof. Ding poses in his textbook chapter on FWL:

![FWL Textbook Chapter Questions](/assets/article_images/2025-07-03-images/fwl_questions.png "FWL Textbook Chapter Questions")

...and a good prospective hire should be able to give reasonable answers without ever having been exposed to FWL formally.

All this being said, I think asking "are these questions fair" does beg the question a little bit that an interview ought to be "fair" in the first place. Is it *really* the responsibility for a hiring team to design an interview that both a 75th percentile candidate and a 99th percentile candidate should be able to pass? I would think no. As ryxcommar points out in another <a href="https://ryxcommar.com/2020/01/27/what-makes-a-interview-homework-assignment-good-or-bad/">blogpost</a>, companies *should* care more about specificity ("identifying all the bad candidates and removing them, at the cost of removing some good candidates") over sensitivity ("identifying all the good candidates and keeping them, at the cost of keeping some bad candidates") in the hiring process. After all, they're usually only hiring one person for one role, so questions like these are really helpful to discriminate between "good" candidates and "great" candidates.

If you've only got one shot at hiring a data scientist, you're gonna need to make sure they're not a complete bum. (And trust me, there are a lot of bums out there.) So interview questions like these ensure that once you find someone who can answer them, that person is almost surely worth their salt. I think ryxcommar is right when he says that "people don’t understand how even the simplest algorithm (OLS / linear regression) works at a strong level," so someone who can quote the FWL theorem or do OLS calculations with measurement error in the regressors is also probably someone who would be a great data scientist.

So in my usual fence-sitting fashion, I think it's true all at once that (1) the questions aren't really fair, especially for junior-level roles, (2) data science interview questions don't actually need to be fair, and ryxcommar is completely correct that you usually don't need to be hiring a data scientist in the first place/a great data scientist will know how to answer these questions, and (3) you could probably ask better questions than these 3 that at the very least don't privilege people with a certain educational training.

---

#### Footnotes
[^1]: <small>For full transparency, I solved Question 2 after Question 3 (I thought Question 3 looked easier but unfortunately I was wrong), and I referred to my <a href="https://arxiv.org/pdf/2401.00649">linear models textbook </a> to solve Question 3 which is where I got this residual formula. I didn't technically use any resources for this question (I know FWL by heart) other than my memory from Question 3 in which I did use an external resource. Guess I'm not getting hired. Oops.</small>
[^2]: <small>It's a question I like so much that I actually assigned it as a homework assignment to a freshman data science cohort I taught through a campus org I was part of at Berkeley.</small>