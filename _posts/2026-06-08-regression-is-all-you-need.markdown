---
layout: post
title:  "Notes with Nav: Regression Is All You Need (Training Camp)"
subtitle: "OLS, FWL, EHW, GLMs, and other three letter acronyms"
date:   2026-06-08 00:00:00 -0500
categories: jekyll update
---

**Table of contents:**
[Part 1: OLS Geometry](#part-1-ols-geometry) | [Part 2: Interpreting OLS Coefficients](#part-2-interpreting-ols-coefficients) | [Part 3: Controls, Residualization (FWL), and Omitted Variable Bias](#part-3-controls-residualization-fwl-and-omitted-variable-bias) | [Part 4: Inference for OLS](#part-4-inference-for-ols) | [Part 5: Model Checking, Misspecification, and Prediction](#part-5-model-checking-misspecification-and-prediction) | [Part 6: Extensions - WLS, GLMs, DML](#part-6-extensions---wls-glms-dml) | [Resources](#resources)


In my <a href="https://arnavg.github.io/jekyll/update/2026/06/04/causal-inference-primer.html">previous post</a>, I covered the basics of causal inference, mainly to introduce the mental model of how to think about causality via counterfactuals.

One thing I did in my LaLonde code example, though, is invoke linear regression to estimate treatment effects, without actually explaining why using regression works. Given the ubiquity of regression models in econometrics, I thought it would be good to actually write a full-length effort post on regression. Plus, the linear algebra behind linear regression informs the intuition for more complicated models, so if you can understand least squares really well, you can understand any learning algorithm really well.

Obviously, I can't cover literally *everything* about regression in this post (look at the <a href="https://en.wikipedia.org/wiki/Regression_analysis">Wiki page for regression analysis</a>, I would have to write my own textbook to cover everything in that one "Part of a series on" side panel), so I'm going to mostly be picking out chunks that I find useful for causal inference and econometrics. If you want an excellent resource to deep-dive on linear models, Peng Ding's <a href="https://arxiv.org/pdf/2401.00649">linear models textbook</a> is probably the best resource out there (and it's free on arxiv!).

## Part 1: OLS Geometry

We all remember how to draw a line through two points. For a pair of coordinates $$(x_1, y_1)$$ and $$(x_2, y_2)$$, there is some line of the form

$$y = mx + b$$

where the "slope" coefficient $$m = \frac{y_2 - y_1}{x_2 - x_1}$$ tells us how much $$y$$ changes for a $$1$$ unit increase in $$x$$, and the "intercept" term $$b$$ can be recovered by plugging in $$0$$ for $$x$$ and solving for $$y$$ (i.e., the intercept value is $$(0, y(0))$$).

<img src="/assets/article_images/2026-06-08-images/two_points_line.png" alt="A line drawn through two points, with slope and intercept annotated">

Why am I re-hashing 8th grade algebra? Well, the whole "$$y = mx + b$$ paradigm" (it feels strange to call it that, I'm sorry) is based on a stylized case where we have two equations ($$y_1 = mx_1 + b$$ and $$y_2 = mx_2 + b$$) and two unknowns, or "parameters," $$m$$ and $$b$$. This is called an *exactly determined* system of equations, where we have the same number of equations as unknowns, and so there is one unique solution for parameters (in this case, $$b$$ and $$m$$) that satisfy this system. In linear algebra terms:

$$
\begin{pmatrix}
1 & x_1 \\
1 & x_2
\end{pmatrix}
\begin{pmatrix}
b \\
m
\end{pmatrix}
=
\begin{pmatrix}
y_1 \\
y_2
\end{pmatrix}
$$

<small><i>Matrix notation for the system of equations, you can use matrix-vector multiplication to recover each equation. Note that we include a column of 1s to accommodate the intercept term (this will come up again later and be very important).</i></small>

But what if, instead of two points, we had three points that looked like this:

<img src="/assets/article_images/2026-06-08-images/three_points_one_off_line.png" alt="A third point slightly off the line through the first two points">

or what if we had several recorded observations of $$x$$ and $$y$$ that looked like this:

<img src="/assets/article_images/2026-06-08-images/noisy_linear_dgp_ols.png" alt="Noisy observations generated from Y equals 1 plus X plus random error, with the true line and OLS fitted line shown">

Now, the problem is that we can't draw a perfectly straight line that passes through every point exactly. In linear algebra terms, we have more equations than unknowns, or an *overdetermined* system, which has no solution. (You can imagine what an *underdetermined* system might look like: one point in $$\mathbb{R}^2$$, where you can draw infinitely many lines that pass through that point.)

What's our best course of action here? Well, for $$n$$ data points, you can always fit an $$n-1$$ degree polynomial that passes through every single data point, but this has a litany of problems. For one, if you look at the scatterplot from above, the pattern looks roughly linear, so a linear model probably more closely captures the "true" data generating process. Additionally, you will quickly run into problems of <a href="https://en.wikipedia.org/wiki/Overfitting">overfitting</a>, where your chosen model will fail to generalize to unseen data. (Will your 59 degree polynomial accurately predict an unseen 61st data point? What happens if you refit a 60-degree polynomial to accommodate this new data point? Bad ideas all around.)

One idea is to fit a "line of best fit" through the data. But what do we mean by "best?" Clearly, some lines fit the data better than others:

<img src="/assets/article_images/2026-06-08-images/candidate_lines_triple_panel.png" alt="Three candidate lines fit through the same noisy linear data">

Line 3 clearly seems "best," because it seems to get the "closest" to the actual data points. This hints at some notion of minimizing errors; in particular, we want to select a line with parameters $$(\beta_0, \beta_1)$$ that gets closest to our data points $$(x_i, y_i)$$. This gives us a minimization problem that might look like:

$$
\arg\min_{\beta_0,\beta_1} \sum_{i=1}^{n} \left(y_i - \hat y_i\right)
=
\arg\min_{\beta_0,\beta_1} \sum_{i=1}^{n} \left(y_i - (\beta_0 + \beta_1 x_i)\right)
$$

But if we left it like this, large positive errors would cancel out large negative errors. For example, the intercept-only model $$\hat{y}_i = \bar{y}$$ has total signed error equal to zero, since $$\sum_i (y_i - \bar{y}) = 0$$. To keep our errors non-negative so that positive and negative mistakes are treated as costly, we can use *squared* error. In principle, we could also use absolute error $$\lvert y_i - \hat y_i\rvert$$, but (1) squared error is differentiable everywhere, (2) it has a nice geometric interpretation, especially in higher dimensions, and (3) the conditional expectation (mean) at the population level $$\mathbb{E}[Y \mid X]$$ will <a href="https://math.stackexchange.com/questions/4540361/prove-conditional-expectation-as-minimization-of-squared-error">always be recovered by minimizing the expected (mean) squared error</a>.

Thus, we have our least-squares problem in $$\mathbb{R}^2$$:

$$
\arg\min_{\beta_0,\beta_1} \sum_{i=1}^{n} \left(y_i - \hat y_i\right)^2
=
\arg\min_{\beta_0,\beta_1} \sum_{i=1}^{n} \left(y_i - (\beta_0 + \beta_1 x_i)\right)^2
$$

We can differentiate w.r.t. $$\beta_0$$ and $$\beta_1$$ and recover the following *least-squares estimates* for our parameters:

$$
\hat{\beta}_1
=
\frac{
\sum_{i=1}^{n} (x_i-\bar{x})(y_i-\bar{y})
}{
\sum_{i=1}^{n} (x_i-\bar{x})^2
}
=
\frac{\text{Cov}(x, y)}{\text{var}(x)},
\qquad
\hat{\beta}_0
=
\bar{y}
-
\hat{\beta}_1 \bar{x}
= 
\bar{y}
-
\frac{\text{Cov}(x, y)}{\text{var}(x)} \bar{x}
$$

<details>
<summary><b>View Derivation</b></summary>

Let

$$
J(\beta_0, \beta_1)
=
\sum_{i=1}^{n}
\left(y_i - (\beta_0 + \beta_1 x_i)\right)^2
$$

Taking the partial derivative with respect to the intercept parameter gives:

$$
\frac{\partial J}{\partial \beta_0}
=
-2 \sum_{i=1}^{n}
\left(y_i - \beta_0 - \beta_1 x_i \right)
$$

Taking the partial derivative with respect to the slope parameter gives:

$$
\frac{\partial J}{\partial \beta_1}
=
-2 \sum_{i=1}^{n}
\left(y_i - \beta_0 - \beta_1 x_i \right)x_i
$$

First, set the derivative with respect to the intercept parameter equal to zero:

$$
-2 \sum_{i=1}^{n}
\left(y_i - \beta_0 - \beta_1 x_i \right)
=
0
$$

Cancel out the -2 term:

$$
\sum_{i=1}^{n}
\left(y_i - \beta_0 - \beta_1 x_i \right)
=
0
$$

Distribute the summation:

$$
\sum_{i=1}^{n} y_i
-
\sum_{i=1}^{n} \beta_0
-
\sum_{i=1}^{n} \beta_1 x_i
=
0
$$

Since beta_0 and beta_1 are constants with respect to i, pull them outside the summations:

$$
\sum_{i=1}^{n} y_i
-
n\beta_0
-
\beta_1 \sum_{i=1}^{n} x_i
=
0
$$

Rearrange:

$$
n\beta_0
=
\sum_{i=1}^{n} y_i
-
\beta_1 \sum_{i=1}^{n} x_i
$$

Divide by n:

$$
\beta_0
=
\frac{1}{n}
\left[
\sum_{i=1}^{n} y_i
-
\beta_1 \sum_{i=1}^{n} x_i
\right]
$$

Using the definitions of the sample means, this becomes:

$$
\hat{\beta}_0
=
\bar{y}
-
\hat{\beta}_1 \bar{x}
$$

Now set the derivative with respect to the slope parameter equal to zero:

$$
-2 \sum_{i=1}^{n}
\left(y_i - \beta_0 - \beta_1 x_i \right)x_i
=
0
$$

Cancel out the -2 term:

$$
\sum_{i=1}^{n}
\left(y_i - \beta_0 - \beta_1 x_i \right)x_i
=
0
$$

Distribute the x_i term:

$$
\sum_{i=1}^{n} y_i x_i
-
\beta_0 \sum_{i=1}^{n} x_i
-
\beta_1 \sum_{i=1}^{n} x_i^2
=
0
$$

Rearrange:

$$
\sum_{i=1}^{n} y_i x_i
-
\beta_0 \sum_{i=1}^{n} x_i
=
\beta_1 \sum_{i=1}^{n} x_i^2
$$

Substitute the expression for the optimal intercept:

$$
\sum_{i=1}^{n} y_i x_i
-
(\bar{y} - \hat{\beta}_1 \bar{x})
\sum_{i=1}^{n} x_i
=
\hat{\beta}_1 \sum_{i=1}^{n} x_i^2
$$

Distribute the term on the left-hand side:

$$
\sum_{i=1}^{n} y_i x_i
-
\bar{y}\sum_{i=1}^{n} x_i
+
\hat{\beta}_1 \bar{x}\sum_{i=1}^{n} x_i
=
\hat{\beta}_1 \sum_{i=1}^{n} x_i^2
$$

Move all terms involving the slope parameter to the right-hand side:

$$
\sum_{i=1}^{n} y_i x_i
-
\bar{y}\sum_{i=1}^{n} x_i
=
\hat{\beta}_1 \sum_{i=1}^{n} x_i^2
-
\hat{\beta}_1 \bar{x}\sum_{i=1}^{n} x_i
$$

Factor out the slope parameter:

$$
\sum_{i=1}^{n} y_i x_i
-
\bar{y}\sum_{i=1}^{n} x_i
=
\hat{\beta}_1
\left[
\sum_{i=1}^{n} x_i^2
-
\bar{x}\sum_{i=1}^{n} x_i
\right]
$$

Divide both sides:

$$
\hat{\beta}_1
=
\frac{
\sum_{i=1}^{n} y_i x_i
-
\bar{y}\sum_{i=1}^{n} x_i
}{
\sum_{i=1}^{n} x_i^2
-
\bar{x}\sum_{i=1}^{n} x_i
}
$$

Now, using the fact that:

$$
\sum_{i=1}^{n} x_i = n\bar{x}
$$

and

$$
\sum_{i=1}^{n} y_i = n\bar{y},
$$

we can simplify the numerator:

$$
\sum_{i=1}^{n} y_i x_i
-
\bar{y}\sum_{i=1}^{n} x_i
=
\sum_{i=1}^{n} y_i x_i
-
n\bar{x}\bar{y}
$$

Now consider the following centered expression:

$$
\sum_{i=1}^{n}
(x_i-\bar{x})(y_i-\bar{y})
$$

Expanding the product inside the summation gives:

$$
\sum_{i=1}^{n}
\left(
x_i y_i
-
x_i\bar{y}
-
\bar{x}y_i
+
\bar{x}\bar{y}
\right)
$$

Distribute the summation:

$$
\sum_{i=1}^{n} x_i y_i
-
\bar{y}\sum_{i=1}^{n} x_i
-
\bar{x}\sum_{i=1}^{n} y_i
+
\sum_{i=1}^{n}\bar{x}\bar{y}
$$

Since x-bar and y-bar are constants with respect to i, this becomes:

$$
\sum_{i=1}^{n} x_i y_i
-
\bar{y}(n\bar{x})
-
\bar{x}(n\bar{y})
+
n\bar{x}\bar{y}
$$

Simplifying:

$$
\sum_{i=1}^{n} x_i y_i
-
n\bar{x}\bar{y}
-
n\bar{x}\bar{y}
+
n\bar{x}\bar{y}
$$

So:

$$
\sum_{i=1}^{n}
(x_i-\bar{x})(y_i-\bar{y})
=
\sum_{i=1}^{n} x_i y_i
-
n\bar{x}\bar{y}
$$

which is exactly the numerator.

Now do the same for the denominator:

$$
\sum_{i=1}^{n} x_i^2
-
\bar{x}\sum_{i=1}^{n} x_i
=
\sum_{i=1}^{n} x_i^2
-
n\bar{x}^2
$$

Consider the centered expression:

$$
\sum_{i=1}^{n}
(x_i-\bar{x})^2
$$

Expanding:

$$
\sum_{i=1}^{n}
\left(
x_i^2
-
2x_i\bar{x}
+
\bar{x}^2
\right)
$$

Distribute the summation:

$$
\sum_{i=1}^{n} x_i^2
-
2\bar{x}\sum_{i=1}^{n} x_i
+
\sum_{i=1}^{n}\bar{x}^2
$$

Using the fact that the sample mean is constant with respect to i:

$$
\sum_{i=1}^{n} x_i^2
-
2\bar{x}(n\bar{x})
+
n\bar{x}^2
$$

Simplifying:

$$
\sum_{i=1}^{n} x_i^2
-
2n\bar{x}^2
+
n\bar{x}^2
$$

So:

$$
\sum_{i=1}^{n}
(x_i-\bar{x})^2
=
\sum_{i=1}^{n} x_i^2
-
n\bar{x}^2
$$

which is exactly the denominator.

Therefore,

$$
\hat{\beta}_1
=
\frac{
\sum_{i=1}^{n} y_i x_i
-
\bar{y}\sum_{i=1}^{n} x_i
}{
\sum_{i=1}^{n} x_i^2
-
\bar{x}\sum_{i=1}^{n} x_i
}
=
\frac{
\sum_{i=1}^{n} (x_i-\bar{x})(y_i-\bar{y})
}{
\sum_{i=1}^{n} (x_i-\bar{x})^2
}
$$

Which is equivalent to:

$$
\hat{\beta}_1
=
\frac{\text{Cov}(x, y)}{\text{var}(x)}
$$

Finally, plugging this back into the intercept formula gives:

$$
\hat{\beta}_0
=
\bar{y}
-
\hat{\beta}_1 \bar{x}
= 
\bar{y}
-
\frac{\text{Cov}(x, y)}{\text{var}(x)} \bar{x}
$$

</details>

<p></p>

This is a fantastic closed-form result in two dimensions, but how do we extend the least-squares problem to higher dimensions? After all, many regressions we run include more than one regressor on the right-hand side ("multiple regression," as it's often called). In particular, we are interested in equations of the form:

$$
\boldsymbol{y} = X\boldsymbol{\beta},
$$

where

$$
\boldsymbol{y}
=
\begin{pmatrix}
y_1 \\
y_2 \\
\vdots \\
y_n
\end{pmatrix}
\in \mathbb{R}^n
$$

is a vector containing our $$n$$ observed outcome values,

$$
X
=
\begin{pmatrix}
1 & x_{11} & x_{12} & \cdots & x_{1,p-1} \\
1 & x_{21} & x_{22} & \cdots & x_{2,p-1} \\
\vdots & \vdots & \vdots & \ddots & \vdots \\
1 & x_{n1} & x_{n2} & \cdots & x_{n,p-1}
\end{pmatrix}
\in \mathbb{R}^{n \times p}
$$

is our design matrix, with $$n$$ rows and $$p$$ columns. The first column is a column of ones for the intercept, and the remaining $$p-1$$ columns contain the observed values of our regressors.

Finally,

$$
\boldsymbol{\beta}
=
\begin{pmatrix}
\beta_0 \\
\beta_1 \\
\vdots \\
\beta_{p-1}
\end{pmatrix}
\in \mathbb{R}^p
$$

is the vector of $$p$$ coefficients we are trying to estimate: one intercept parameter and $$p-1$$ slope parameters.

We will once again assume that we have an overdetermined system, i.e. $$n > p$$. Each column of the design matrix $$X$$ is a vector in $$\mathbb{R}^n$$, and the set of all linear combinations of these columns forms the **column space** of $$X$$, denoted $$\operatorname{Col}(X)$$ or $$\operatorname{Im}(X)$$.

$$
\operatorname{Col}(X)
=
\{X\boldsymbol{\beta}: \boldsymbol{\beta}\in\mathbb{R}^p\}
\subseteq \mathbb{R}^n.
$$

In other words, as we vary the coefficient vector $$\boldsymbol{\beta}$$, the fitted values $$X\boldsymbol{\beta}$$ can only move around inside the column space of $$X$$. But our observed outcome vector $$\boldsymbol{y}$$ also lives in $$\mathbb{R}^n$$, and in an overdetermined system it will generally not lie exactly inside $$\operatorname{Col}(X)$$. When that happens, there is no coefficient vector $$\boldsymbol{\beta}$$ such that

$$
\boldsymbol{y} = X\boldsymbol{\beta}.
$$

However, we can once again invoke least squares, which solves this problem by finding the vector in $$\operatorname{Col}(X)$$ that is closest to $$\boldsymbol{y}$$. This closest vector is the fitted value vector

$$
\hat{\boldsymbol{y}} = X\hat{\boldsymbol{\beta}},
$$

which is the orthogonal projection of $$\boldsymbol{y}$$ onto $$\operatorname{Col}(X)$$. The leftover piece,

$$
\hat{\boldsymbol{\varepsilon}}
=
\boldsymbol{y} - X\hat{\boldsymbol{\beta}},
$$

is the residual vector. The defining geometric property of the least-squares problem is that this residual vector is orthogonal to the column space of $$X$$:

$$
X^\top \hat{\boldsymbol{\varepsilon}} = 0
$$

<img src="/assets/article_images/2026-06-08-images/ols_geometry.png" alt="OLS geometry showing the projection of the outcome vector onto the column space of the design matrix" width="500">

The geometric interpretation gives us a very clean, easy way to solve for the least-squares parameters $$\hat{\boldsymbol{\beta}}$$. Since the residual vector is orthogonal to the column space of $$X$$ (i.e., the inner product between the residual vector and each column of $$X$$ is 0, as shown above), we can simply substitute $$\hat{\boldsymbol{\varepsilon}} = \boldsymbol{y} - X\hat{\boldsymbol{\beta}}$$ to obtain the *normal equations* and solve for $$\hat{\boldsymbol{\beta}}$$:

$$
X^\top \left(\boldsymbol{y} - X\hat{\boldsymbol{\beta}}\right) = 0
$$

$$
\implies X^\top \boldsymbol{y} - X^\top X\hat{\boldsymbol{\beta}} = 0
$$

$$
\implies X^\top \boldsymbol{y} = X^\top X\hat{\boldsymbol{\beta}}
$$

Assuming that $$X$$ has full column rank and is therefore invertible:

$$
\implies \left(X^\top X\right)^{-1} X^\top \boldsymbol{y} = \left(X^\top X\right)^{-1} X^\top X\hat{\boldsymbol{\beta}}
$$

$$
\therefore \hat{\boldsymbol{\beta}} = \left(X^\top X\right)^{-1} X^\top \boldsymbol{y}
$$

This same result can also be obtained through vector calculus; we can solve the least-squares objective

$$
\hat{\boldsymbol{\beta}} = \arg\min_{\boldsymbol{\beta}} \lVert \boldsymbol{y} - X \boldsymbol{\beta} \rVert^{2}_2
$$

which is directly analogous to minimizing squared distance in $$\mathbb{R}^2$$ (we use the L2 norm operator $$\lVert \cdot \rVert _{2}$$ to denote Euclidean distance).

<details>
<summary><b>View Derivation</b></summary>

Let the optimization objective be

$$J(\boldsymbol{\beta}) = \lVert \boldsymbol{y} - X \boldsymbol{\beta} \rVert^{2}_2$$

By definition,

$$\lVert \boldsymbol{y} - X \boldsymbol{\beta} \rVert^{2}_2 = \left(\boldsymbol{y} - X \boldsymbol{\beta}\right)^\top\left(\boldsymbol{y} - X \boldsymbol{\beta}\right)$$

$$\left(\boldsymbol{y}^\top - \boldsymbol{\beta}^\top X^\top \right) \left(\boldsymbol{y} - X \boldsymbol{\beta}\right)$$

$$ = \boldsymbol{y}^\top \boldsymbol{y} - \boldsymbol{y}^\top X\boldsymbol{\beta} - \boldsymbol{\beta}^\top X^\top \boldsymbol{y} + \boldsymbol{\beta}^\top X^\top X\boldsymbol{\beta}$$

$$= \boldsymbol{y}^\top \boldsymbol{y} -  2 \boldsymbol{y}^\top X \boldsymbol{\beta} + \boldsymbol{\beta}^\top X^\top X \boldsymbol{\beta}$$

Taking the gradient of the objective and setting equal to 0:

$$\nabla J(\boldsymbol{\beta}) = 2 X^\top X \boldsymbol{\beta}  - 2 X^\top y = 0$$

$$\implies X^\top X \boldsymbol{\beta} = X^\top y$$

If we once again assume that the design matrix is full-rank and therefore invertible:

$$\hat{\boldsymbol{\beta}} = \left( X^\top X\right)^{-1} X^\top y$$

</details>

<p></p>

This method of estimating the parameters $$\boldsymbol{\beta}$$ in a linear model is known as **ordinary least squares** (OLS). The main machinery that makes OLS work is orthogonal projection; more specifically, our fitted outcomes are the result of projecting observed outcomes onto the column space of $$X$$. Intuitively, this can be thought of as finding the "best approximation" to $$\boldsymbol{y}$$ that is contained in the information of the covariates $$X$$.

Formally, we can express our fitted values as the result of a projection matrix transformation onto the observed values as follows:

$$\hat{\boldsymbol{y}} = X \hat{\boldsymbol{\beta}} = X \left( X^\top X\right)^{-1} X^\top \boldsymbol{y}$$

If we let $$H = X \left( X^\top X\right)^{-1} X^\top$$, we can verify that:

1. $$H$$ is a symmetric matrix because $$H^\top = \left(X \left( X^\top X\right)^{-1} X^\top\right)^\top = (X^\top)^\top \left(\left( X^\top X\right)^{-1}\right)^\top (X)^\top = X \left( X^\top X\right)^{-1} X^\top = H$$. Note that because $$X^\top X$$ is symmetric, so is its inverse, so this step works.
2. $$H$$ is idempotent because $$H^2 = X \left( X^\top X\right)^{-1} X^\top X \left( X^\top X\right)^{-1} X^\top = X I_p \left( X^\top X\right)^{-1} X^\top = H$$

Therefore, $$H$$ is an orthogonal projection matrix, and $$H\boldsymbol{y}$$ is the orthogonal projection of $$\boldsymbol{y}$$ onto $$\operatorname{Col}(X)$$. The residual vector $$\boldsymbol{\hat{\varepsilon}} = \boldsymbol{y} - H \boldsymbol{y}$$ is the part of $$\boldsymbol{y}$$ left over after this projection, and it is orthogonal to every column of $$X$$. Another helpful interpretation of this residual term is that it is the "unexplained" part of our regression; it is the leftover variation in an outcome that remains after we have used the columns of $$X$$ to explain as much of it as possible. (This will be super duper important later.)

Very importantly, when I say "linear model," that doesn't mean every $$X$$ term has to be linear. "Linearity" here refers to *linearity in the parameters* of the model. We can torture the design matrix with whatever data transformations we want (which is actually extremely common to do, as we will see later), but the parameters are not allowed to be expressed as non-linear functions. Basically, these are all linear models:

- $$Y = \hat{\alpha} + \hat{\beta} \log X$$
- $$Y = \hat{\alpha} + \hat{\beta} \sin(X_1) + \hat{\gamma} \cos(X_2)$$
- $$Y = \hat{\alpha} + \hat{\beta} e^{X_1} + \hat{\gamma} \arctan(\arcsin(|X_2^3|))$$

while these are not:

- $$Y = \log(\hat{\alpha} + \hat{\beta}) + \sin(\hat{\beta}^2) X$$
- $$Y = e^{\hat{\alpha}^2} + \tanh(\hat{\beta} + \hat{\alpha}^2 \log \hat{\gamma}) X$$


One important detail that I won't cover in detail but would at least like to mention: computationally speaking, calculating the OLS coefficients is not a trivial problem. The closed-form solution requires the matrix inverse $$(X^\top X)^{-1}$$, but this is usually better understood as a conceptual formula than as a literal computational recipe. If $$X \in \mathbb{R}^{n \times p}$$, then $$X^\top X$$ is a $$p \times p$$ matrix, so the standard Gauss-Jordan elimination procedure we're taught in linear algebra has a time complexity of roughly $$O(p^3)$$ for the inversion step, after spending about $$O(np^2)$$ operations to form $$X^\top X$$. There have been faster optimizations of this such as the <a href="https://en.wikipedia.org/wiki/Strassen_algorithm">Strassen algorithm</a>, which can do matrix multiplication/inversion in roughly $$O(p^{\log_2 7})$$ time, but in practice, numerical solvers usually avoid explicitly forming and inverting $$X^\top X$$ because it can be numerically unstable. R's `lm` function, for example, uses the <a href="https://thomvolker.github.io/blog/2506_regression/#:~:text=Solving%20the%20normal%20equations%20through%20a%20QR%20decomposition">QR decomposition</a> to solve the least-squares problem (SVD and Cholesky decompositions work similarly ... highly recommend reading the linked blogpost, might do my own in the future). For single point/rank-one updates, least-squares can be done recursively via the <a href="https://patrickyin.me/undergrad_notes/img/Woodbury.pdf">Sherman-Morrison formula</a> or the more general Woodbury identity, reducing updates to roughly $$O(p^2)$$ per new observation rather than requiring a full refit. In principle, <a href="https://en.wikipedia.org/wiki/Gradient_descent">gradient descent</a> can also be used for <a href="http://ibm.com/think/topics/gradient-descent">iterative minimization</a> of the least-squares objective directly, though for classical low- or moderate-dimensional OLS, direct linear algebra solvers are usually preferred.

## Part 2: Interpreting OLS Coefficients

In the previous post on causal inference, you may recall that to estimate the average treatment effect in the LaLonde experiment, we ran a regression that looked like this:

$$Y_i = \alpha + \tau D_i + \epsilon_i$$

where $$D_i \in \{0, 1\}$$ is a binary treatment indicator and $$\tau$$ is the ATE estimate. In particular, $$\tau$$ represented the **difference in mean outcome** $$Y$$ between the treatment group ($$D_i = 1$$) and control group ($$D_i = 0$$).

But why is this true? There's a couple of ways to look at it.

First, there's the algebraic perspective. If our design matrix has a column of $$1$$s for the intercept and a column of $$n_0$$ $$0$$s and $$n_1$$ $$1$$s for the treatment indicator, i.e.

$$
X
=
\begin{pmatrix}
1 & 0 \\
1 & 0 \\
\vdots & \vdots \\
1 & 0 \\
1 & 1 \\
1 & 1 \\
\vdots & \vdots \\
1 & 1
\end{pmatrix},
\qquad
\boldsymbol{\beta}
=
\begin{pmatrix}
\alpha \\
\tau
\end{pmatrix},
\qquad
\boldsymbol{y}
=
\begin{pmatrix}
y_1 \\
y_2 \\
\vdots \\
y_n
\end{pmatrix}.
$$

then the OLS estimator $$\hat{\boldsymbol{\beta}} = (X^\top X)^{-1}X^\top \boldsymbol{y}$$ can be broken down as follows:


$$\hat{\boldsymbol{\beta}} = \begin{pmatrix} \hat{\alpha} \\ \hat{\tau} \end{pmatrix} = \begin{pmatrix} \bar{y}_0 \\ \bar{y}_1 - \bar{y}_0 \end{pmatrix}$$

where $$\bar{y}_1 = \frac{1}{n_1} \sum_{i:D_i=1} y_i$$ is the mean outcome among treated units, and $$\bar{y}_0 = \frac{1}{n_0} \sum_{i:D_i=0} y_i$$ is the mean outcome among control units. Thus, $$\hat{\alpha}$$ is the mean of the reference group $$D_i = 0$$ (in this setting, the control group mean), while $$\hat{\tau}$$ is the difference-in-means between the treatment group $$D_i = 1$$ and the control group (so the treatment group mean is $$\hat{\alpha} + \hat{\tau}$$).

<details>
<summary><b>View Derivation</b></summary>

First, we can compute the design matrix cross-product:

$$
X^\top X
=
\begin{pmatrix}
1 & 1 & \cdots & 1 & 1 & 1 & \cdots & 1 \\
0 & 0 & \cdots & 0 & 1 & 1 & \cdots & 1
\end{pmatrix}
\begin{pmatrix}
1 & 0 \\
1 & 0 \\
\vdots & \vdots \\
1 & 0 \\
1 & 1 \\
1 & 1 \\
\vdots & \vdots \\
1 & 1
\end{pmatrix}
=
\begin{pmatrix}
n_0 + n_1 & n_1 \\
n_1 & n_1
\end{pmatrix}
=
\begin{pmatrix}
n & n_1 \\
n_1 & n_1
\end{pmatrix}
$$

Next, we can compute the design matrix multiplied by the outcome vector:

$$
X^\top \boldsymbol{y}
=
\begin{pmatrix}
1 & 1 & \cdots & 1 & 1 & 1 & \cdots & 1 \\
0 & 0 & \cdots & 0 & 1 & 1 & \cdots & 1
\end{pmatrix}
\begin{pmatrix}
y_1 \\
y_2 \\
\vdots \\
y_{n_0} \\
y_{n_0+1} \\
y_{n_0+2} \\
\vdots \\
y_n
\end{pmatrix}
=
\begin{pmatrix}
\sum_{i=1}^{n} y_i \\
\sum_{i:D_i=1} y_i
\end{pmatrix}.
$$

Therefore,

$$
\hat{\boldsymbol{\beta}}
=
\begin{pmatrix}
\hat{\alpha} \\
\hat{\tau}
\end{pmatrix}
=
\left[
\begin{pmatrix}
n & n_1 \\
n_1 & n_1
\end{pmatrix}
\right]^{-1}
\begin{pmatrix}
\sum_{i=1}^{n} y_i \\
\sum_{i:D_i=1} y_i
\end{pmatrix}
$$

Since

$$
\left[
\begin{pmatrix}
n & n_1 \\
n_1 & n_1
\end{pmatrix}
\right]^{-1}
=
\frac{1}{n_0n_1}
\begin{pmatrix}
n_1 & -n_1 \\
-n_1 & n
\end{pmatrix},
$$

we get

$$
\begin{pmatrix}
\hat{\alpha} \\
\hat{\tau}
\end{pmatrix}
=
\frac{1}{n_0n_1}
\begin{pmatrix}
n_1 & -n_1 \\
-n_1 & n
\end{pmatrix}
\begin{pmatrix}
\sum_{i=1}^{n} y_i \\
\sum_{i:D_i=1} y_i
\end{pmatrix}
$$

That means that

$$
\hat{\tau}
=
-\frac{n_1}{n_0 n_1}
\sum_{i=1}^{n} y_i
+
\frac{n}{n_0 n_1}
\sum_{i:D_i=1} y_i
$$

$$
=
\frac{n}{n_0 n_1}
\sum_{i:D_i=1} y_i
-
\frac{1}{n_0}
\sum_{i=1}^{n} y_i
$$

$$
=
\frac{n}{n_0 n_1}
\sum_{i:D_i=1} y_i
-
\frac{1}{n_0}
\left(
\sum_{i:D_i=0} y_i
+
\sum_{i:D_i=1} y_i
\right)
$$

$$
=
\frac{n}{n_0 n_1}
\sum_{i:D_i=1} y_i
-
\frac{1}{n_0}
\sum_{i:D_i=0} y_i
-
\frac{1}{n_0}
\sum_{i:D_i=1} y_i
$$

$$
=
\left(
\frac{n}{n_0 n_1}
-
\frac{1}{n_0}
\right)
\sum_{i:D_i=1} y_i
-
\frac{1}{n_0}
\sum_{i:D_i=0} y_i
$$

Since $$n = n_0 + n_1$$ we have:

$$
\frac{n}{n_0 n_1}
-
\frac{1}{n_0}
=
\frac{n}{n_0 n_1}
-
\frac{n_1}{n_0 n_1}
=
\frac{n - n_1}{n_0 n_1}
=
\frac{n_0}{n_0 n_1}
=
\frac{1}{n_1}
$$

Therefore,

$$
\hat{\tau}
=
\frac{1}{n_1}
\sum_{i:D_i=1} y_i
-
\frac{1}{n_0}
\sum_{i:D_i=0} y_i
$$

Similarly,

$$
\hat{\alpha}
=
\frac{n_1}{n_0n_1}
\sum_{i=1}^{n} y_i
-
\frac{n_1}{n_0n_1}
\sum_{i:D_i=1} y_i
$$

$$
=
\frac{1}{n_0}
\left(
\sum_{i=1}^{n} y_i
-
\sum_{i:D_i=1} y_i
\right)
$$

$$
=
\frac{1}{n_0}
\sum_{i:D_i=0} y_i
=
\bar{y}_0.
$$

So the intercept is the mean outcome for the reference group, where $$D_i = 0$$

</details>

<p></p>

While satisfactory in a mathematical sense, this explanation is not particularly intuitive. For that, we can use the geometric interpretation of orthogonal projection.

A useful way to build intuition is to start with a tiny binary-regressor example. Suppose we have one point at $$x=0$$ and one point at $$x=1$$. Then the system is exactly determined, and the fitted line passes through both points. But now suppose we add a third point at $$x=1$$. Here, the system becomes overdetermined, as there is no single line that can pass through all three points exactly.

So what should the line of best fit do? Intuitively, it should still pass through the point at $$x=0$$, but at $$x=1$$ it should ideally try to find the "middle" of the two observed points. If we add a fourth point at $$x=0$$ as well, the same logic applies on both sides: the line of best fit should pass through the average of the points at $$x=0$$ and the average of the points at $$x=1$$.

<img src="/assets/article_images/2026-06-08-images/binary_indicator_means_side_by_side.png" alt="Side-by-side illustration showing that with a binary regressor, OLS fits a line through the group means at x equals 0 and x equals 1">

In OLS with a binary regressor, since the only possible $$x$$-values are $$0$$ and $$1$$, the fitted line is completely determined by its fitted height at $$x=0$$ and its fitted height at $$x=1$$. OLS chooses those two heights to minimize squared error, and the squared-error minimizer for a stack of points is just the mean of that stack.

Now we can formalize this geometric intuition by translating it into the projection language from earlier. If we think of orthogonal projection as the “shadow” of $$\boldsymbol{y}$$, then in the binary-regressor case that shadow is forced to live in the space of lines determined by one fitted value at $$x=0$$ and one fitted value at $$x=1$$.

Recall that in OLS, our fitted values are the projection of the observed outcome vector $$\boldsymbol{y}$$ onto the column space of the design matrix $$X$$. In the binary-treatment regression, our design matrix has two columns: an intercept column of $$1$$s and a treatment indicator column $$D_i \in \{0,1\}$$. So the column space is the set of all linear combinations of these two columns:

$$X\boldsymbol{\beta} = \alpha \cdot \boldsymbol{1} + \tau \cdot \boldsymbol{D}$$

Because $$D_i$$ can only take on the values $$0$$ and $$1$$, any fitted value vector $$X\boldsymbol{\beta}$$ must be constant within each treatment group. For control units, where $$D_i = 0$$, the fitted value is $$\hat{y}_i = \alpha$$, while for treated units, where $$D_i = 1$$, the fitted value is $$\hat{y}_i = \alpha + \tau$$.

Importantly, the column space of $$X$$ is not the space of arbitrary outcome vectors. It is the space of vectors that assign one constant fitted value to all control units and another constant fitted value to all treated units. For example, if we had two control units and three treated units, every vector in $$\operatorname{Col}(X)$$ would have the form

$$
X
\begin{pmatrix}
\alpha \\
\tau
\end{pmatrix}
=
\begin{pmatrix}
\alpha \\
\alpha \\
\alpha + \tau \\
\alpha + \tau \\
\alpha + \tau
\end{pmatrix}
$$

and OLS would recover the fitted-value vector $$\hat{\boldsymbol{y}}$$ of this form closest to the observed outcome vector $$\boldsymbol{y}$$, which is done by replacing each observation with its group mean.

For the control group, OLS must choose a single fitted value $$a$$ for all units with $$D_i = 0$$. That means it solves

$$
\min_a \sum_{i:D_i=0} (y_i - a)^2
$$

The minimizer of squared error is the mean (very simple to derive, just differentiate the quadratic and set equal to 0), so $$a = \frac{1}{n_0} \sum_{i:D_i=0} y_i = \bar{y}_0$$.

Likewise, for the treatment group, OLS must choose a single fitted value $$b$$ for all units with $$D_i = 1$$:

$$
\min_b \sum_{i:D_i=1} (y_i - b)^2,
$$

which gives $$b = \bar{y}_1$$ through a simple differentiation step. Therefore, the fitted values from the binary-treatment regression are

$$
\hat{y}_i
=
\begin{cases}
\bar{y}_0, & D_i = 0 \\
\bar{y}_1, & D_i = 1.
\end{cases}
$$

Through a quick substitution into our regression model, we can easily show that the treatment effect estimate $$\hat{\tau}$$ is the difference-in-means:

$$\hat{y}_i = \hat{\alpha} + \hat{\tau}D_i = \bar{y}_0 + (\bar{y}_1 - \bar{y}_0)D_i$$

Here's a visualization to illustrate this idea. The points are the observed outcomes, and the horizontal lines are the fitted values from OLS. Because the only regressor is a binary treatment indicator, OLS fits one constant value for the control group and one constant value for the treatment group, which are the respective group means.

<img src="/assets/article_images/2026-06-08-images/binary_treatment_group_means.png" alt="OLS with a binary treatment indicator fits the mean outcome for each group">

Another way to see this is to look directly at the projection matrix $$H = X(X^\top X)^{-1}X^\top$$. For this binary-treatment regression, the projection matrix has a block structure:
1. Within the control group, it averages the control outcomes
2. Within the treatment group, it averages the treatment outcomes
3. Across groups, the weights are zero

<img src="/assets/article_images/2026-06-08-images/binary_treatment_projection_matrix.png" alt="Projection matrix for a binary treatment regression showing block averaging within treatment and control groups">

This means that when the projection matrix is applied to the observed outcome vector $$\boldsymbol{y}$$, it effectively replaces each observed outcome with the average outcome of the group it belongs to. Control units get mapped to the control-group mean $$\bar{y}_0$$, treated units get mapped to the treatment-group mean $$\bar{y}_1$$, and the fitted value vector becomes

$$
H\boldsymbol{y}
=
\hat{\boldsymbol{y}}
=
\begin{pmatrix}
\bar{y}_0 \\
\vdots \\
\bar{y}_0 \\
\bar{y}_1 \\
\vdots \\
\bar{y}_1
\end{pmatrix}.
$$

The fitted value vector $$\hat{\boldsymbol{y}} = H\boldsymbol{y}$$ is the closest vector to $$\boldsymbol{y}$$ inside the column space of $$X$$. In the binary-treatment case, that column space consists of vectors that are constant within each group. Therefore, projecting onto that space replaces each observed outcome with its group mean. The residuals are then the within-group deviations from those means:

$$
\hat{\varepsilon}_i
=
y_i - \bar{y}_0
\quad \text{if } D_i=0,
$$

and

$$
\hat{\varepsilon}_i
=
y_i - \bar{y}_1
\quad \text{if } D_i=1
$$

This is why in a completely randomized experiment, we regress the outcome on the treatment assignment dummy to estimate the ATE; while OLS on a binary indicator will always recover the difference-in-means between the two groups as the coefficient, it's not a given that this coefficient represents anything causal. As shown in the LaLone example in my previous post, causal claims require either randomization in the experimental design, or in the case of observational data, require ignorability/unconfoundedness.

One neat implication of this fact about regression on binary indicators is that under certain distributional assumptions about the error term of our linear model, we can essentially re-discover hypothesis tests by doing regression. This reminds me of this blogpost: <a href="https://lindeloev.github.io/tests-as-linear/">common statistical tests are linear models</a>.

Let's start with the two-sample $$t$$-test. Suppose we have two groups:

$$z_1,\ldots,z_m \overset{iid}{\sim} N(\mu_1,\sigma^2), \qquad w_1,\ldots,w_n \overset{iid}{\sim} N(\mu_2,\sigma^2)$$

and we want to test the null hypothesis that these two group samples have the same mean, i.e. $$H_0: \mu_1 = \mu_2$$.

The usual equal-variance two-sample $$t$$-test uses the statistic

$$t_{\text{equal}} = \frac{\bar{z} - \bar{w}} {\hat{\sigma}\sqrt{m^{-1}+n^{-1}}},$$ where $$\hat{\sigma}^2 = \frac{(m-1)S_z^2 + (n-1)S_w^2}{m+n-2}$$.

But we can write the exact same problem as a regression! Stack the outcomes into one vector:

$$
\boldsymbol{Y}
=
\begin{pmatrix}
z_1 \\
\vdots \\
z_m \\
w_1 \\
\vdots \\
w_n
\end{pmatrix}
$$

Now define the design matrix $$ X = \begin{pmatrix} 1 & 1 \\ \vdots & \vdots \\ 1 & 1 \\ 1 & 0 \\ \vdots & \vdots \\ 1 & 0 \end{pmatrix}, \qquad \boldsymbol{\beta} = \begin{pmatrix} \beta_0 \\ \beta_1 \end{pmatrix}$$

The first $$m$$ rows correspond to the $$z$$ group, and the last $$n$$ rows correspond to the $$w$$ group. Under this parameterization, the fitted value for the $$w$$ group is $$\beta_0$$, while the fitted value for the $$z$$ group is $$\beta_0 + \beta_1$$. Thus, $$\beta_1$$ is simply the difference between the two group means, i.e. $$\hat{\beta}_1 = \bar{z} - \bar{w}$$, and testing whether the two population means are equal is therefore the same as testing whether the treatment/group coefficient is zero, i.e. $$H_0: \beta_1 = 0$$.

The OLS $$t$$-statistic for $$\hat{\beta}_1$$ is

$$
t_{\text{OLS}}
=
\frac{\hat{\beta}_1 - 0}
{\operatorname{SE}(\hat{\beta}_1)}.
$$

Under the homoskedastic normal linear model, the covariance matrix of the OLS estimator is

$$
\operatorname{Var}(\hat{\boldsymbol{\beta}} \mid X)
=
\sigma^2 (X^\top X)^{-1}.
$$

Since $$\sigma^2$$ is unknown, we estimate it with the pooled residual variance $$\hat{\sigma}^2$$, giving

$$
\widehat{\operatorname{Var}}(\hat{\boldsymbol{\beta}} \mid X)
=
\hat{\sigma}^2 (X^\top X)^{-1}.
$$

Therefore, the estimated variance of the slope coefficient $$\hat{\beta}_1$$ is the $$(2,2)$$ entry of this covariance matrix:

$$
\widehat{\operatorname{Var}}(\hat{\beta}_1 \mid X)
=
\hat{\sigma}^2 [(X^\top X)^{-1}]_{22}.
$$

So the standard error is

$$
\operatorname{SE}(\hat{\beta}_1)
=
\hat{\sigma}\sqrt{[(X^\top X)^{-1}]_{22}},
$$

and the OLS $$t$$-statistic becomes

$$
t_{\text{OLS}}
=
\frac{\hat{\beta}_1}
{\hat{\sigma}\sqrt{[(X^\top X)^{-1}]_{22}}}.
$$

For this design matrix, the cross-product matrix is

$$
X^\top X
=
\begin{pmatrix}
m+n & m \\
m & m
\end{pmatrix},
$$

and its inverse is

$$
(X^\top X)^{-1}
=
\frac{1}{mn}
\begin{pmatrix}
m & -m \\
-m & m+n
\end{pmatrix}.
$$

$$
\therefore [(X^\top X)^{-1}]_{22}
=
\frac{m+n}{mn}
=
\frac{1}{m} + \frac{1}{n}.
$$

Substituting this into the standard error gives

$$
\operatorname{SE}(\hat{\beta}_1)
=
\hat{\sigma}
\sqrt{
\frac{1}{m} + \frac{1}{n}
}.
$$

Since $$\hat{\beta}_1 = \bar{z} - \bar{w}$$, the OLS $$t$$-statistic becomes

$$
t_{\text{OLS}}
=
\frac{\bar{z} - \bar{w}}
{\hat{\sigma}\sqrt{m^{-1}+n^{-1}}},
$$

which is exactly the equal-variance two-sample $$t$$-statistic:

$$
t_{\text{OLS}} = t_{\text{equal}}.
$$

So the classical two-sample $$t$$-test is just the coefficient test from a regression of the outcome on an intercept and a binary group indicator, under the normal linear model with equal variances across groups. The regression coefficient gives the difference in means, and the usual OLS standard error gives the pooled-variance standard error from the equal-variance $$t$$-test. This is one of my favorite linear modeling results because of how neatly it connects regression to very basic hypothesis tests (under the correct inferential assumptions about the error term). Equipped with the $$t$$-statistic, you can now judge difference-in-means coefficients by their level of statistical significance, pretty neat! (Note that you can also calculate the $$t$$-statistic and $$p$$-value even if the regressor isn't binary, but the neat result here is that the OLS $$t$$-statistic gets you the standard two-sample $$t$$-statistic almost for free.)

It's also worth mentioning that you can directly recover ANOVA from regressing your outcome variable on group dummies; in fact, this is my standard mental model for thinking about the ANOVA as I don't even bother remembering the details of the formal hypothesis test.

If a binary indicator regression recovers two group means, then a regression on multiple group indicators recovers multiple group means. Testing whether the treatment has any effect becomes a test of whether all those group means are equal.

Suppose there are $$J$$ treatment levels. Let $$\mathcal{T}_j$$ be the set of units assigned to treatment level $$j$$, with sample size $$n_j = \mid \mathcal{T}_j \mid$$, and define the group mean

$$\bar{y}_j = \frac{1}{n_j} \sum_{i\in \mathcal{T}_j} y_i$$

If we regress $$Y$$ on treatment-level indicators without an intercept, the design matrix has one column per group. The unrestricted regression is

$$Y_i = \beta_1 \mathbf{1}\{i \in \mathcal{T}_1\} + \beta_2 \mathbf{1}\{i \in \mathcal{T}_2\} + \cdots + \beta_J \mathbf{1}\{i \in \mathcal{T}_J\} + \varepsilon_i$$

and the fitted value for each unit in group $$j$$ obtained from OLS is simply $$\hat{y}_i = \bar{y}_j$$.

<img src="/assets/article_images/2026-06-08-images/anova_group_means_regression.png" alt="ANOVA shown as regression on treatment group indicators, with group mean fitted values and the grand mean null model">

So the unrestricted model fits one mean per group; the restricted model under the null hypothesis $$H_0: \beta_1 = \cdots = \beta_J$$ forces all groups to share the same fitted value; in regression form, this is just the intercept-only model

$$Y_i = \beta_0 + \varepsilon_i$$

through which OLS recovers the grand mean $$\hat{\beta_0} = \bar{y} = \frac{1}{n} \sum_{i=1}^{n} y_i$$. The **ANOVA $$F$$-statistic** compares how much worse the restricted grand-mean model fits relative to the unrestricted group-means model.

The numerator measures between-group variation...

$$
\sum_{j=1}^{J} n_j(\bar{y}_j - \bar{y})^2
$$

...while the denominator measures within-group variation:

$$
\sum_{j=1}^{J}\sum_{i\in \mathcal{T}_j}(y_i-\bar{y}_j)^2
$$

After dividing by the appropriate degrees of freedom, the resulting statistic is

$$
F
=
\frac{
\sum_{j=1}^{J} n_j(\bar{y}_j-\bar{y})^2/(J-1)
}{
\sum_{j=1}^{J}\sum_{i\in \mathcal{T}_j}(y_i-\bar{y}_j)^2/(n-J)
}
\sim F_{J-1,n-J}
$$

under the normal linear model and the null hypothesis of equal group means.

So ANOVA is also a regression test. The unrestricted regression projects $$\boldsymbol{y}$$ onto the space of group-mean vectors, while the restricted model projects $$\boldsymbol{y}$$ onto the smaller space of constant vectors. Through the $$F$$-test, we can determine whether allowing separate group means reduces squared error enough to justify the extra parameters.

The lesson overall is that regressing onto a binary regressor (plus an intercept) will recover OLS coefficients that represent the difference in means between two groups. When we add additional regressors, the interpretation becomes an *adjusted* difference in means where the coefficient on the binary regressor represents the difference between the two groups holding the other regressors fixed. For example, in one of the LaLonde specifications, we ran:

$$\text{Real income in 1978}_i = \beta_0 + \beta_1 \text{NSW Program Treatment Indicator}_i + \beta_2 \text{Age}_i + \epsilon_i$$

Here, the OLS estimate $$\hat{\beta}_1$$ would represent the difference in 1978 real incomes between NSW job-training program participants vs. non-participants, *holding age fixed*. For two individuals who had the same age $$a$$ but only differed in whether they participated in the job-training program, their expected difference in real incomes would be $$\hat{\beta_0} + \hat{\beta_1} \cdot 1 + \beta_2 \cdot a - \hat{\beta_0} - \hat{\beta_1} \cdot 0 - \beta_2 \cdot a = \hat{\beta_1}$$. (Of course, "holding age fixed" is a regression adjustment statement and doesn't automatically guarantee a causal interpretation.) Similarly, we can interpret $$\hat{\beta}_2$$ as the expected change in 1978 real income associated with a one-year increase in age, holding treatment status fixed.

<img src="/assets/article_images/2026-06-08-images/lalonde_age_re78_parallel_fit.png" alt="Scatterplot of real income in 1978 versus age with parallel fitted lines by treatment status">

For categorical regressors with *more* than two categories, we can create a regression with $$k - 1$$ dummy variables for each of the $$k$$ represented categories, omitting one category to avoid multicollinearity. For example, in the LaLonde example, "race" was originally coded as "White," "Black," and "Hispanic." We could run the regression:

$$\text{Real income in 1978}_i = \beta_0 + \beta_1 \text{NSW Program Treatment Indicator}_i + \beta_2 \text{Black}_i + \beta_3 \text{Hispanic}_i + \epsilon_i$$

By omitting the "White" racial category from the regression, we are using this as our race-category reference group; the OLS estimates $$\hat{\beta_2}$$ and $$\hat{\beta_3}$$ therefore represent the average difference in 1978 real incomes between Black and White individuals and Hispanic and White individuals, holding treatment status fixed. It's helpful to think of these dummy variables as "light switches" we can turn on or off to recover expected outcomes. For example:

- If we wanted to know the expected 1978 real income of White participants in the job-training program, we would "turn off" the $$\text{Black}_i$$ and $$\text{Hispanic}_i$$ indicators by setting them equal to 0, and "turn on" the $$\text{NSW Program Treatment Indicator}_i$$ by setting it equal to 1. This would give us $$\hat{\beta_0} + \hat{\beta_1}$$.
- By contrast, if we wanted to know the expected 1978 real income of White individuals *not* in the job-training program, we would "turn off" the treatment indicator switch and get $$\hat{\beta_0}$$. Once again, we see that $$\hat{\beta_1}$$ represents the difference in expected 1978 real incomes between individuals *in the race reference group* who participated in the program and those who didn't.

So far, these dummy variables have behaved like simple level shifters. Turning on the treatment indicator shifts expected income by $$\hat{\beta}_1$$, while turning on the $$\text{Black}_i$$ indicator shifts expected income by $$\hat{\beta}_2$$ relative to the White reference group. However, this implicitly bakes in a strong assumption into the model, which is that **these effects are purely additive**. The treatment coefficient $$\hat{\beta}_1$$ is the same regardless of race, and the race coefficients are the same regardless of treatment status. In the LaLonde experimental data plot, we see this is visualized as parallel slopes for the treatment and control group; the increase in 1978 real incomes for every year of age is the same across both groups, but the levels are shifted which is represented in the regression coefficient.

In other words, each of these models assumes that treatment status and the other covariates do not modify each other's relationship with the outcome.

But this isn't always realistic; it's entirely plausible (and perhaps even expected) that the job-training program has a different association with earnings for different racial groups or age groups. More generally, the effect of one variable might depend on the value of another variable.

Luckily, this is fairly simple to handle within our regression via **interaction terms**. Recalling our light switch analogy for dummy variables, interaction terms are like switches that only turn on when two conditions are true at the same time. Instead of assuming that the treatment effect is the same at every age, or that the age slope is the same for treated and control units, we can add a new regressor that is the *product* of the two variables.

For example, suppose we add an interaction between treatment and age:

$$
\text{Real income in 1978}_i
=
\beta_0
+
\beta_1 \text{Treatment}_i
+
\beta_2 \text{Age}_i
+
\beta_3(\text{Treatment}_i \times \text{Age}_i)
+
\epsilon_i.
$$

Without the interaction term, treatment can shift the fitted line up or down, but both groups are forced to share the same age slope. With the interaction term, treated and untreated individuals can have different age slopes.

<img src="/assets/article_images/2026-06-08-images/lalonde_age_treatment_interaction_comparison.png" alt="Comparison of LaLonde regressions with and without a treatment-by-age interaction term">

If we take a look at the matrix math, without the interaction term, the design matrix has columns for the intercept, treatment, and age:

$$
X
=
\begin{pmatrix}
1 & T_1 & A_1 \\
1 & T_2 & A_2 \\
\vdots & \vdots & \vdots \\
1 & T_n & A_n
\end{pmatrix}.
$$

With the interaction term, though, we add a fourth column equal to the elementwise product of treatment and age:

$$
X
=
\begin{pmatrix}
1 & T_1 & A_1 & T_1 \times A_1 \\
1 & T_2 & A_2 & T_2 \times A_2 \\
\vdots & \vdots & \vdots & \vdots \\
1 & T_n & A_n & T_n \times A_n
\end{pmatrix}.
$$

This new column changes the set of fitted-value vectors the regression is allowed to produce. Without the interaction, the fitted values are constrained to follow the form

$$
\hat{Y}_i
=
\hat{\beta}_0
+
\hat{\beta}_1T_i
+
\hat{\beta}_2A_i.
$$

For control units, where $$T_i=0$$, this becomes

$$
\hat{Y}_i
=
\hat{\beta}_0
+
\hat{\beta}_2A_i.
$$

For treated units, where $$T_i=1$$, this becomes

$$
\hat{Y}_i
=
(\hat{\beta}_0+\hat{\beta}_1)
+
\hat{\beta}_2A_i.
$$

Here, treatment is changing the intercept, but the slope on age is still $$\hat{\beta}_2$$ for both groups. Geometrically, the two fitted lines are forced to be parallel (see the first LaLonde visualization).

However, once we add the interaction term, the fitted values become

$$
\hat{Y}_i
=
\hat{\beta}_0
+
\hat{\beta}_1T_i
+
\hat{\beta}_2A_i
+
\hat{\beta}_3(T_i \times A_i).
$$

For control units, where $$T_i=0$$, this is still

$$
\hat{Y}_i
=
\hat{\beta}_0
+
\hat{\beta}_2A_i.
$$

But for treated units, where $$T_i=1$$, this becomes

$$
\hat{Y}_i
=
(\hat{\beta}_0+\hat{\beta}_1)
+
(\hat{\beta}_2+\hat{\beta}_3)A_i.
$$

Now treatment changes both the intercept and the age slope. The treatment coefficient $$\hat{\beta}_1$$ is the intercept shift for treated units, while the interaction coefficient $$\hat{\beta}_3$$ is the slope shift for treated units. In other words, the interaction term expands the column space of $$X$$ so that OLS can project $$\boldsymbol{Y}$$ onto a richer space, fitting one line for controls and a different line for treated units.

In causal inference, interaction terms can be used to analyze heterogeneous treatment effects (as we can kind of see in the LaLonde example). Importantly, interaction terms also form the backbone for **difference-in-differences** (DiD) analyses. If a policy, say a minimum wage increase, is passed in one state but not another, we can compare how the unemployment rate changed in the treated state before versus after the policy *relative to how it changed in the control state* over the same period. Under the parallel trends assumption, this lets us estimate the effect of the policy relative to the counterfactual trend the treated group would have followed absent treatment.

Formally, in the simplest two-group, two-period setup, DiD estimates the **average treatment effect on the treated (ATT)** via the model specification:

$$\text{Unemployment Rate}_{it} = \beta_0 + \beta_1 \text{Treated}_i + \beta_2 \text{Post}_t + \beta_3(\text{Treated}_i \times \text{Post}t) + \epsilon{it}$$

Here, $$\text{Treated}_i$$ indicates whether unit $$i$$ belongs to the treatment group, $$\text{Post}_t$$ indicates whether the observation occurs after the policy change, and the interaction term $$\text{Treated}_i \times \text{Post}_t$$ turns on only for treated units in the post-treatment period. The coefficient $$\beta_3$$ is the DiD estimate of interest, capturing the treated group's before-after change minus the control group's before-after change.

<img src="/assets/article_images/2026-06-08-images/did_example.jpg" alt="Comparison of LaLonde regressions with and without a treatment-by-age interaction term">

One subtlety, returning to the LaLonde treatment-by-age specification, is that once we include an interaction term, the “main effect” $$\hat{\beta}_1$$ is no longer the treatment-control difference at every age. In the model

$$
\beta_0
+
\beta_1 \text{Treatment}_i
+
\beta_2 \text{Age}_i
+
\beta_3(\text{Treatment}_i \times \text{Age}_i)
+
\epsilon_i,
$$

the coefficient $$\hat{\beta}_1$$ is the treatment-control difference when $$\text{Age}_i = 0$$. More generally, at age $$a$$, the fitted treatment-control difference is

$$
\hat{\beta}_1 + \hat{\beta}_3 a.
$$

This is why **centering continuous variables** before interacting them, by subtracting the column mean from every entry such that the column mean becomes 0, can make the main effects easier to interpret. If age were centered around the sample mean, then $$\hat{\beta}_1$$ would represent the fitted treatment-control difference at the average age, rather than at age zero.

One last note on OLS coefficient interpretation: while any model that is linear in its parameters is a "linear model," sometimes, these models are not linear in the covariates, which can lead to worse data fit. For example:

<img src="/assets/article_images/2026-06-08-images/nonlinear_relationships_scatter.png" alt="Side-by-side scatterplots showing exponential and logarithmic relationships between X and Y">

However, as we mentioned before, we can use variable transformations to produce better model fits to the data with OLS, so long as the models stay linear in the parameters. In this case, we can fit the models

$$\log(Y_i) = \beta_0 + \beta_1 X_i + \epsilon_i$$

and

$$Y_i = \beta_0 + \beta_1 \log(X_i) + \epsilon_i$$

to handle nonlinearity in the covariates.

<img src="/assets/article_images/2026-06-08-images/linear_models_log_transformations.png" alt="Side-by-side plot showing exponential and logarithmic relationships that become easier to model after log transformations">

However, it's important to be cognizant that this changes the interpretation of the coefficients.

- In a **log-linear** regression,
  
  $$
  \log(Y_i) = \beta_0 + \beta_1 X_i + \epsilon_i,
  $$
  
  a one-unit increase in $$X_i$$ is associated with a $$\beta_1$$ increase in $$\log(Y_i)$$. On the original $$Y$$ scale, this means a one-unit increase in $$X_i$$ is associated with an approximately $$100 \cdot \beta_1 \%$$ change in $$Y_i$$. More precisely, the exact percent change is
  
  $$
  100 \cdot (e^{\beta_1} - 1)\%.
  $$

- In a **linear-log** regression,
  
  $$
  Y_i = \beta_0 + \beta_1 \log(X_i) + \epsilon_i,
  $$
  
  a one-percent increase in $$X_i$$ is associated with an approximately $$\beta_1 / 100$$ unit change in $$Y_i$$. More generally, a $$c\%$$ increase in $$X_i$$ is associated with a change of
  
  $$
  \beta_1 \log\left(1 + \frac{c}{100}\right)
  $$
  
  units in $$Y_i$$.

- In a **log-log** regression,
  
  $$
  \log(Y_i) = \beta_0 + \beta_1 \log(X_i) + \epsilon_i,
  $$
  
  $$\beta_1$$ is an **elasticity**: a one-percent increase in $$X_i$$ is associated with an approximately $$\beta_1\%$$ change in $$Y_i$$. More generally, a $$c\%$$ increase in $$X_i$$ is associated with an approximately $$\beta_1 \cdot c\%$$ change in $$Y_i$$. The exact percent change is
  
  $$
  100 \cdot \left[\left(1 + \frac{c}{100}\right)^{\beta_1} - 1\right]\%.
  $$

I use logarithmic transformations as my motivating example because of their convenient interpretations, as well as their connection to Poisson regression which I'll cover in the GLMs section, but in principle, any functional transformation of $$X$$ or $$Y$$ can work. In the causal inference context, as long as the choice of transformation can be correctly interpreted and justified as part of the causal DGP, the transformation is fair game; in many purely predictive machine learning contexts, the interpretation may not really matter at all as long as out-of-sample fit improves.

Based on the <a href="https://stats.stackexchange.com/questions/199256/how-to-interpret-regression-equations-with-logarithms-based-on-log-difference-b"> linear-log interpretation table</a> from what I believe is the Stock and Watson econometrics textbook, I've come up with my own "extended table" on how to interpret OLS coefficients across various scenarios covered in this entire section

| Scenario | Regression specification | Coefficient interpretation |
|---|---|---|
| **One continuous regressor** | $$Y_i = \beta_0 + \beta_1 X_i + \epsilon_i$$ | - $$\hat{\beta}_0$$ is the fitted value of $$Y$$ when $$X_i = 0$$.<br>- $$\hat{\beta}_1$$ is the expected unit change in $$Y$$ associated with a one-unit increase in $$X$$. |
| **One binary categorical regressor** | $$Y_i = \beta_0 + \beta_1 D_i + \epsilon_i$$ | - $$\hat{\beta}_0 = \bar{Y}_0$$, the mean outcome for the reference group where $$D_i = 0$$.<br>- $$\hat{\beta}_1 = \bar{Y}_1 - \bar{Y}_0$$, the difference in means between the $$D_i = 1$$ group and the reference group. |
| **ANOVA / one dummy per group, no intercept** | $$Y_i = \beta_1 X_{1i} + \cdots + \beta_J X_{Ji} + \epsilon_i$$ | - Each $$X_{ji}$$ is an indicator for group $$j$$.<br>- $$\hat{\beta}_j = \bar{Y}_j$$, the mean outcome for group $$j$$.<br>- Testing $$H_0: \beta_1 = \cdots = \beta_J$$ recovers the ANOVA test of equal group means. |
| **Categorical regressor with reference class** | $$Y_i = \beta_0 + \beta_1 X_{1i} + \cdots + \beta_{J-1}X_{J-1,i} + \epsilon_i$$ | - One category is omitted as the reference group.<br>- $$\hat{\beta}_0$$ is the mean outcome for the reference group.<br>- $$\hat{\beta}_j$$ is the difference in mean outcome between group $$j$$ and the reference group. |
| **Two continuous regressors** | $$Y_i = \beta_0 + \beta_1 X_{1i} + \beta_2 X_{2i} + \epsilon_i$$ | - $$\hat{\beta}_1$$ is the expected unit change in $$Y$$ associated with a one-unit increase in $$X_1$$, holding $$X_2$$ fixed.<br>- $$\hat{\beta}_2$$ is the expected unit change in $$Y$$ associated with a one-unit increase in $$X_2$$, holding $$X_1$$ fixed. |
| **One continuous regressor and one binary categorical regressor** | $$Y_i = \beta_0 + \beta_1 X_i + \beta_2 D_i + \epsilon_i$$ | - $$\hat{\beta}_0$$ is the fitted value for the reference group when $$X_i = 0$$.<br>- $$\hat{\beta}_1$$ is the slope of $$Y$$ with respect to $$X$$, holding group status fixed.<br>- $$\hat{\beta}_2$$ is the adjusted difference in fitted outcomes between the $$D_i = 1$$ group and the reference group, holding $$X$$ fixed. |
| **Two continuous regressors with an interaction** | $$Y_i = \beta_0 + \beta_1 X_{1i} + \beta_2 X_{2i} + \beta_3(X_{1i}X_{2i}) + \epsilon_i$$ | - $$\hat{\beta}_1$$ is the effect of $$X_1$$ when $$X_2 = 0$$.<br>- $$\hat{\beta}_2$$ is the effect of $$X_2$$ when $$X_1 = 0$$.<br>- $$\hat{\beta}_3$$ tells us how much the effect of $$X_1$$ changes as $$X_2$$ increases by one unit, and equivalently how much the effect of $$X_2$$ changes as $$X_1$$ increases by one unit.<br>- The fitted effect of $$X_1$$ at $$X_2 = x_2$$ is $$\hat{\beta}_1 + \hat{\beta}_3 x_2$$.<br>- The fitted effect of $$X_2$$ at $$X_1 = x_1$$ is $$\hat{\beta}_2 + \hat{\beta}_3 x_1$$. |
| **One continuous regressor, one binary categorical regressor, and an interaction** | $$Y_i = \beta_0 + \beta_1 X_i + \beta_2 D_i + \beta_3(X_iD_i) + \epsilon_i$$ | - For the reference group where $$D_i = 0$$, the fitted line is $$\hat{Y}_i = \hat{\beta}_0 + \hat{\beta}_1X_i$$.<br>- For the group where $$D_i = 1$$, the fitted line is $$\hat{Y}_i = (\hat{\beta}_0+\hat{\beta}_2) + (\hat{\beta}_1+\hat{\beta}_3)X_i$$.<br>- $$\hat{\beta}_2$$ is the difference between groups when $$X_i = 0$$.<br>- $$\hat{\beta}_3$$ is the difference in slopes between the two groups.<br>- At $$X_i = x$$, the fitted group difference is $$\hat{\beta}_2 + \hat{\beta}_3x$$. |
| **Two binary categorical regressors with an interaction** | $$Y_i = \beta_0 + \beta_1 D_{1i} + \beta_2 D_{2i} + \beta_3(D_{1i}D_{2i}) + \epsilon_i$$ | - $$\hat{\beta}_0$$ is the fitted mean for the reference group where $$D_{1i}=0$$ and $$D_{2i}=0$$.<br>- $$\hat{\beta}_1$$ is the difference associated with turning on $$D_1$$ when $$D_2=0$$.<br>- $$\hat{\beta}_2$$ is the difference associated with turning on $$D_2$$ when $$D_1=0$$.<br>- $$\hat{\beta}_3$$ is the additional difference when both $$D_1=1$$ and $$D_2=1$$ beyond the sum of the two separate main effects.<br>- The fitted mean when both switches are on is $$\hat{\beta}_0+\hat{\beta}_1+\hat{\beta}_2+\hat{\beta}_3$$. |
| **Log-linear regression** | $$\log(Y_i) = \beta_0 + \beta_1 X_i + \epsilon_i$$ | - $$\hat{\beta}_1$$ is the expected unit change in $$\log(Y)$$ associated with a one-unit increase in $$X$$.<br>- On the original $$Y$$ scale, a one-unit increase in $$X$$ is associated with an approximate $$100\hat{\beta}_1\%$$ change in $$Y$$.<br>- The exact percent change is $$100(e^{\hat{\beta}_1}-1)\%$$. |
| **Linear-log regression** | $$Y_i = \beta_0 + \beta_1 \log(X_i) + \epsilon_i$$ | - $$\hat{\beta}_1$$ is the expected unit change in $$Y$$ associated with a one-unit increase in $$\log(X)$$.<br>- A 1% increase in $$X$$ is associated with an approximate $$\hat{\beta}_1/100$$ unit change in $$Y$$.<br>- More generally, a $$c\%$$ increase in $$X$$ is associated with a change of $$\hat{\beta}_1 \log(1+c/100)$$ units in $$Y$$. |
| **Log-log regression** | $$\log(Y_i) = \beta_0 + \beta_1 \log(X_i) + \epsilon_i$$ | - $$\hat{\beta}_1$$ is an elasticity.<br>- A 1% increase in $$X$$ is associated with an approximate $$\hat{\beta}_1\%$$ change in $$Y$$.<br>- More generally, a $$c\%$$ increase in $$X$$ is associated with an approximate $$\hat{\beta}_1 \cdot c\%$$ change in $$Y$$.<br>- The exact percent change is $$100\left[\left(1+c/100\right)^{\hat{\beta}_1}-1\right]\%$$. |

## Part 3: Controls, Residualization (FWL), and Omitted Variable Bias

Coming soon!

## Part 4: Inference for OLS

Coming soon!

## Part 5: Model Checking, Misspecification, and Prediction

Coming soon!

## Part 6: Extensions - WLS, GLMs, DML

Coming soon!

## Resources

- Peng Ding, <a href="https://arxiv.org/pdf/2401.00649">"Linear Model and Extensions"</a> (my personal linear models bible)