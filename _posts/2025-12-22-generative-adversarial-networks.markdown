---
layout: post
title:  "Notes with Nav: Generative Adversarial Networks"
subtitle: "Notes from my generative models class"
date:   2025-12-22 00:00:00 -0500
categories: jekyll update
---

## GAN Motivation

- Previous methods for training deep generative models relied on (approximate) maximum likelihood of a parametric distribution
    - e.g., Boltzmann Machines require computing expectations over the entire model distribution (sum over all possible images and hidden states)
- These methods are computationally intractable to compute exactly, and they are typically approximated using MCMC-based sampling (approximate inference)
- Enter **Generative Adversarial Networks** (GANs): they are trained only with backpropagation (no Markov chains), which provides computational and statistical advantages over previous methods (see original paper: <a href="https://arxiv.org/abs/1406.2661">link</a>)


## GAN Intuition

- Two components of a GAN: a **Generator** network, and a **Discriminator** network
    - The Generator is analogous to a team of counterfeiters who produce "fake" data samples
    - The Discriminator is analogous to the police; learns whether a proposed sample comes from the data distribution (real) or model distribution (fake)
    - This adversarial game drives the generative model to keep producing better and better counterfeits until the discriminative model can no longer distinguish between real and fake samples

### Visualizer: Training

<img src="/assets/article_images/2025-12-22-images/gan_training_visualizer.gif" alt="GAN Training Visualizer" title="GAN Training Visualizer" width="700">

<a href="https://newsletter.theaiedge.io/p/how-generative-adversarial-networks">(Source)</a>

### Visualizer: Generated Image Quality over Epochs

<img src="/assets/article_images/2025-12-22-images/gan_image_quality_over_epochs.gif" alt="GAN Image Quality Over Epochs" title="GAN Image Quality Over Epochs" width="700">

<a href="https://blog.ovhcloud.com/understanding-image-generation-beginner-guide-generative-adversarial-networks-gan/">(Source)</a>

## GAN Architecture Overview

A Generative Adversarial Net (GAN) consists of two parts:

- *Generator (G)*:  $$G(z; \theta_g)$$ is a Multilayer Perceptron (MLP) mapping noise $$z \sim p(z)$$ to samples $$x_G = G(z)$$ to imitate the data distribution $$p_{\text{data}}$$.
- *Discriminator (D)*: $$D(x; \theta_d)$$ is an MLP binary classifier, with $$D(x)\in(0,1)$$ representing the probability that $$x$$ is real. 

<img src="/assets/article_images/2025-12-22-images/GAN.jpg" alt="GAN Architecture" title="GAN Architecture" width="700">

## Training Scheme

1. We train $$D$$ to maximize the probability of assigning the correct label to both training examples and samples from $$G$$.
    - This corresponds to simply maximizing the (binary) log-likelihood of the correct real/fake label
2. We simultaneously train $$G$$ to minimize the probability of D making a correct classification on a fake image sample $$\log\!\big(1 - D(G(z))\big)$$.
    - This also comes from binary log-likelihood
3. Together, the training loss corresponds to a **minimax two player game**, where the Discriminator learns parameters to maximize the expected log probability of assigning the correct label to both real and fake samples, while the Generator learns its parameters to minimize the second term, the expected log probability that D correctly recognizes a generated sample as fake.
4. Therefore the training loss can be expressed as:

$$ \min_{G} \max_{D} V(D,G) = \mathbb{E}_{x\sim p_{\text{data}}}\!\big[\log D(x)\big] + \mathbb{E}_{z\sim p_{z}}\!\big[\log\!\big(1 - D(G(z))\big)\big]$$

In concept, if $$G$$ makes $$D(G(z))$$ large (which is a probability really close to 1) then $$\log(1 - D(G(z)))$$ becomes very large and negative, which then reduces the objective since $$G$$ is fooling $$D$$ with its generated examples.


### Value Function Derivation

Let the ground truth label be $$y \in \{0, 1\}$$. For counterfeit sample $$x = G(z)$$ the label is $$y = 0$$.

Recall that $$D$$ outputs probability of a sample $$x$$ being from the data distribution with Bernoulli likelihood:

$$(D(x))^y (1 - D(x))^{1 - y}$$

Which corresponds to the log-likelihood:

$$L(y; D(x)) = y \log D(x) + (1 - y) \log (1 - D(x))$$

When $$y = 0$$ (counterfeit), $$D(x)$$ becomes $$D(G(z))$$

- With probability $$\frac{1}{2} \rightarrow y = 1$$, $$x \sim p_{data}$$
- With probability $$\frac{1}{2} \rightarrow y = 0$$, $$x \sim p_{g}$$ (or equivalently, $$z \sim p_z$$)[^1]

$$\therefore$$ The game's value function $$V(D, G)$$ is the expected log likelihood over all the reals and fakes:

$$\min_G \max_D \frac{1}{2} \cdot \mathbb{E}_{x \sim p_{data}} \big[\log D(x)\big] + \frac{1}{2} \cdot \mathbb{E}_{z\sim p_z} \big[\log(1 - D(G(z)))\big]$$

We can notice how only the second term in the optimization problem depends on $$G$$, so minimizing $$V$$ with respect to $$G$$ is therefore equivalent to minimizing that second expression (the expected log probability that the Discriminator correctly recognizes a generated sample as fake):

$$\min_G \mathbb{E}_{z\sim p_z} \big[\log(1 - D(G(z)))\big]$$

### Training Algorithm

This is the training algorithm the authors of the original GAN paper implemented in order to optimize this loss. The authors state that optimizing $$D$$ to completion in the inner loop is computationally difficult and results in overfitting; instead, they alternate between optimizing $$D$$ for $$k$$ steps for every 1 step of $$G$$, where $$k$$ is a hyperparameter. In their implementation they used $$k = 1$$ for computational simplicity.

<img src="/assets/article_images/2025-12-22-images/GAN_algo.png" alt="GAN Algorithm" title="GAN Algorithm" width="700">

The inner loop runs the Discriminator update $$k$$ times. The authors take $$m$$ samples of the latent variable $$z$$ from the prior distribution, and then take $$m$$ minibatch samples from the training data. Since we are seeking to *maximize* the objective function with respect to the Discriminator, we use stochastic gradient *ascent* in the forward pass and then update the parameters of the network accordingly in the backward pass.

Then, we train the Generator by sampling from our noise prior and then mapping the noise to the data space. And since we are *minimizing* the value function with respect to the Generator, we use stochastic gradient *descent* to update the network parameters.

One important thing to note is that the minimax problem may not provide sufficient gradient for $$G$$ to learn well. In early learning when $$G$$ is poor, the Generator is proposing highly noisy counterfeit images, and so the Discriminator will reject samples with high confidence because they are clearly different from the training data distribution.

This saturates $$\log(1 - D(G(z)))$$, which means that the loss becomes locally flat because the gradients for $$G$$ vanish during training, which gives $$G$$ almost no learning signal.

So instead, we can train $$G$$ to maximize $$\log(D(G(z)))$$ which gives much stronger gradients with the same Nash equilibrium.

### Optimal Discriminator *(D)*

If you choose a $$G$$ to minimize the minimax problem with $$D^*$$ as the optimal Discriminator, you would recover that the minimum is reached only when the Generator's distribution equals the data distribution, so $$p_{data}(x) = p_g(x)$$.

In other words, for $$G$$ fixed, the optimal Discriminator $$D$$ is

$$D_G^{*}(x)=\frac{p_{data}(x)}{p_{data}(x)+p_g(x)}$$

This is the "unique solution" at the level of distributions, but the authors note that it is not unique in network parameters because many different Generators could induce the same model distribution $$p_g$$.

When $$p_g = p_{data}$$ the formula above gives $$D^* = \frac{1}{2}$$ for every sample $$x$$
- This means that at equilibrium, the Discriminator can no longer tell a real sample from a fake sample so the best it can do is just randomly guess probability 0.5.

**Proof:**

For fixed $$G$$, the Discriminator $$D$$ is trained to maximize

$$V(G,D) = \mathbb{E}_{x\sim p_{\text{data}}}[\log D(x)] + \mathbb{E}_{z\sim p_z}[\log(1 - D(G(z)))]$$

Writing these expectations as an integral over $$x$$ and using that $$G(z)$$ induces the model distribution $$p_g(x)$$, we get

$$V(G,D) = \int_x p_{\text{data}}(x) \log D(x) dx + \int_z p_z(z) \log(1 - D(g(z))) dz$$

$$= \int_x \Big[p_{\text{data}}(x) \log D(x) + p_g(x) \log(1 - D(x)) \Big] dx$$

$$D(x)\in(0,1)$$, so we can maximize it *pointwise*. Define

$$f_x(D) = p_{\text{data}}(x)\,\log D + p_g(x)\,\log(1 - D), \qquad D \in (0,1)$$

Take the derivative with respect to $$D$$ and set it to zero:

$$\frac{\partial f_x}{\partial D} = \frac{p_{\text{data}}(x)}{D} - \frac{p_g(x)}{1 - D} = 0$$

Solving for $$D^*$$, $$\frac{p_{\text{data}}(x)}{D} = \frac{p_g(x)}{1 - D} \;\Rightarrow\; p_{\text{data}}(x)(1 - D) = p_g(x)D$$

$$ 
\Rightarrow\; p_{\text{data}}(x) = (p_{\text{data}}(x) + p_g(x))\,D \;\Rightarrow\; D^*(x) = \frac{p_{\text{data}}(x)}{p_{\text{data}}(x)+p_g(x)} \Box.$$

### Optimal Generator *(G)*

We can proceed with solving for the global minimum of our virtual training criterion $$V(D^*, G) = C(G)$$ by substituting the value of $$D^*(x)$$ into the value function and then minimizing over $$G$$.

Denote $$m(x)=\tfrac{1}{2}\big(p_{\text{data}}(x)+p_g(x)\big)$$

$$
\begin{align*}
C(G)
&= \mathbb{E}_{x\sim p_{\text{data}}}
   \left[
      \log \frac{p_{\text{data}}(x)}
      {p_{\text{data}}(x) + p_g(x)}
   \right]
   + \mathbb{E}_{x\sim p_g}
   \left[
      \log \frac{p_g(x)}
      {p_{\text{data}}(x) + p_g(x)}
   \right] \\
&= \mathbb{E}_{x\sim p_{\text{data}}}
   \left[
      \log \frac{p_{\text{data}}(x)}{2m(x)}
   \right]
   + \mathbb{E}_{x\sim p_g}
   \left[
      \log \frac{p_g(x)}{2m(x)}
   \right]
   \quad  \\
& = \int_x p_{data}(x)
\left[
  \log \frac{p_{\text{data}}(x)}{m(x)} - \log 2 \right] + 
  p_g(x)\left[\log \frac{p_g(x)}{m(x)} - \log 2
\right] dx
\end{align*}
$$

That key algebraic step is that we're able to break off this $$-\log 2$$ term, and then using basic additivity of integration, we can break up our integral such that we have two $$-\log 2$$ terms multiplied by the integral over two probability densities, which both integrate to 1.

$$
\begin{align*}
\int_x p_{data}(x) \log \frac{p_{\text{data}}(x)}{m(x)} + p_g(x) \log \frac{p_g(x)}{m(x)} dx - \log 2 \int_x p_{data}(x) dx - \log 2 \int_x p_{g}(x) dx
\quad  \\
% &= -\log 4
%    + KL\!\left(p_{\text{data}}\middle\|m\right)
%    + KL\!\left(p_g\middle\|m\right). \\
% &= -\log 4 +2 \cdot JS (p_{data} \| p_g)
\end{align*}
$$

We are left with 

$$
C(G) =\int_x p_{data}(x) \log \frac{p_{\text{data}}(x)}{m(x)}dx + \int_x p_g(x) \log \frac{p_g(x)}{m(x)} dx - 2 \log 2
$$

The key insights from here are that:
- We can directly use the definition of **KL-Divergence** in our training criterion: $$\text{KL}(p(x) \parallel m(x)) = \int_x p(x) \log \frac{p(x)}{m(x)} dx$$
- We can also use the definition of **Jensen-Shannon Divergence**: $$\text{JS}(p(x) \parallel q(x)) = \frac{1}{2} \text{KL}(p(x) \parallel m(x)) + \frac{1}{2}\text{KL}(q(x) \parallel m(x))$$

Here, KL-Divergence represents the expected extra "surprise" or log-loss incurred by using the mixture distribution $$m$$ instead of the true data source.

From here we can make some substitutions that follow from these definitions, and we find that the training criterion is exactly equal to:

$$C(G) = \text{KL}(p_{data}(x) \parallel m(x)) + \text{KL}(p_{g}(x) \parallel m(x)) - \log 4$$

$$= 2 \cdot \text{JS}(p_{data}(x), p_g(x)) - \log 4$$

Since $$\text{JS}(p_{data}(x) \parallel p_g(x)) \geq 0$$ with equality iff $$p_{data}(x) = p_g(x)$$, the global minimum of $$C(G)$$ must be $$-\log 4$$ and the unique solution $$p_{data}(x) = p_g(x)$$, i.e. the **training loss is minimized when the Generator is able to perfectly imitate samples from the data distribution.**

### Convergence of the Training Algorithm

If $$G$$ and $$D$$ have enough capacity, and if at each step of the algorithm, the Discriminator is allowed to reach its optimum given $$G$$, and if $$p_g$$ is updated so as to improve the the criterion:

$$\mathbb{E}_{x \sim p_{data} [\log D_G^*(x)]}+ \mathbb{E}_{x \sim p_{g} [\log (1-D_G^*(x))]}$$

then $$p_g$$ converges to $$p_{data}$$.

If $$p_g = p_{data}$$, then in the formula for $$D^*(x)$$:

$$D^*(x) = \frac{p_{data}(x)}{p_{data}(x) + p_g(x)} = \frac{p_{data}(x)}{2p_{data}(x)} = \frac{1}{2}$$

The implication here is that at equilibrium, the Generator will produce counterfeit samples that are indistinguishable from the true samples, so the best the Discriminator can do is randomly guess whether a sample is real or fake.

That's illustrated by this figure here, where at initialization, the discriminative distribution in blue is able to distinguish between samples from the true data distribution in black and the generative distribution in green, based on where those samples have higher probability density.

<img src="/assets/article_images/2025-12-22-images/discriminator_at_equilibrium.png" alt="Discriminator at Equilibrium" title="Discriminator at Equilibrium" width="700">

But as you can see, over multiple training iterations, the discriminative power becomes much weaker until the Discriminator can only do as well as predicting 0.5 since the generative distribution and data distribution become identical at convergence.

## Code Implementation and Experiments

This is the architectural design specified in the original GAN paper for the MNIST digit classification task:

**Generator (G)**

$$
\begin{array}{c}
z \in \mathbb{R}^{100} \\
\downarrow\ \mathrm{ReLU}\ (1200) \\
\downarrow\ \mathrm{ReLU}\ (1200) \\
\downarrow\ \sigma\ (784) \\
\widehat{x}\in[0,1]^{784}
\end{array}
$$

- Latent $$z \sim \mathrm{Uniform}(-1,1)$$, dim $$100$$
- Output bias init $$\leftarrow$$ MNIST marginals

---

**Discriminator (D)**

$$
\begin{array}{c}
x \in [0,1]^{784} \\
\downarrow\ \mathrm{Maxout}\ (U{=}240,\ k{=}5) \\
\downarrow\ \mathrm{Maxout}\ (U{=}240,\ k{=}5) \\
\downarrow\ \sigma\ (1) \\
p_\theta(\mathrm{real}\mid x)
\end{array}
$$

- Maxout: each unit is $$\max$$ over $$k$$ affine pieces

First, take a look at the Generator. They sample 100-dimensional latent variable $$z$$ from a Uniform distribution on $$[-1, 1]$$. Then, they feed the input noise forward through two linear layers of dimension 1200 with ReLU activation, and then have a final layer which matches the input dimension of the flattened MNIST digit vector of 784 with sigmoid activation. The result is a synthetically generated data sample that maps the input noise vector to the dimension of the data space.

Meanwhile, the Discriminator is given a flattened 784-dimensional image sample, either real or generated. It passes this through two fully-connected Maxout[^2] layers, each with 240 units and $$k = 5$$ pieces, so every unit outputs the max over 5 separate affine responses and can represent a richer piecewise-linear function of the input.

After those two Maxout layers, there's a final 1-dimensional linear layer followed by a sigmoid, which outputs the model's estimated probability that the input image is real rather than generated.

Below, I have two implementations of the GAN in PyTorch. The first one is faithful to the paper's architecture, while the second one involves some modifications for better generation performance.

### Model Implementation 1: Original Paper Architecture

Training setup details:
- Dataset split: 50,000 train, 10,000 validation examples.
- Latent noise: $$z \sim \mathrm{Uniform}(-1, 1)$$ with dimension 100.
- Loss: **binary cross-entropy** matches $$y \log D(x) + (1-y)\log(1-D(x))$$ from minimax objective; sigmoid output.
- Optimizer: **SGD with momentum**; we do gradient *ascent* on $$D$$ and gradient *descent* on $$G$$, consistent with the minimax objective.
- Label smoothing: $$\texttt{smooth\_real = 0.9}$$ so real labels are clipped, preventing $$D$$ from becoming overconfident early in training.

<details>
<summary><b>View Dependencies</b></summary>
{% highlight python %}
!pip install torchmetrics
!pip install torchmetrics[image]
!pip install torch-fidelity
{% endhighlight %}
</details>

<details>
<summary><b>View Imports</b></summary>
{% highlight python %}
# Imports
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import random_split, DataLoader
import torchvision
from torchvision import datasets, transforms
from torch.autograd import Variable, Function

import importlib
import torchmetrics.image.fid as tm_fid
importlib.reload(tm_fid)
from torchmetrics.image.fid import FrechetInceptionDistance

import numpy as np
import matplotlib.pyplot as plt

{% endhighlight %}
</details>

<details>
<summary><b>View Model Classes</b></summary>
{% highlight python %}
class Maxout(nn.Module):
  def __init__(self, in_features, out_features, num_pieces=5, bias=True):
    super().__init__()
    self.out_features = out_features
    self.num_pieces = num_pieces
    self.linear = nn.Linear(in_features, out_features * num_pieces, bias=bias)

  def forward(self, x):
    B = x.shape[0]
    x = self.linear(x)
    x = x.view(B, self.out_features, self.num_pieces)
    x = x.max(dim=2).values
    return x

class Generator(nn.Module):
  def __init__(self, z_dim, img_dim=784):
    super().__init__()
    self.fc1 = nn.Linear(z_dim, 1200)
    self.relu = nn.ReLU()
    self.fc2 = nn.Linear(1200, 1200)
    self.fc3 = nn.Linear(1200, img_dim)
    # self.sigmoid = nn.Sigmoid()

    # Weight initialization scheme described in paper
    nn.init.uniform_(self.fc1.weight, -0.05, 0.05)
    nn.init.zeros_(self.fc1.bias)
    nn.init.uniform_(self.fc2.weight, -0.05, 0.05)
    nn.init.zeros_(self.fc2.bias)
    nn.init.uniform_(self.fc3.weight, -0.05, 0.05)
    nn.init.zeros_(self.fc3.bias)

  def forward(self, z):
    out = self.fc1(z)
    out = self.relu(out)
    out = self.fc2(out)
    out = self.relu(out)
    out = self.fc3(out)
    # out = self.sigmoid(out)
    return out

class Discriminator(nn.Module):
  def __init__(self, num_units=240, img_dim=784, num_pieces=5):
    super().__init__()
    self.h0 = Maxout(img_dim, num_units, num_pieces)
    self.h1 = Maxout(num_units, num_units, num_pieces)
    self.fc3 = nn.Linear(num_units, 1)
    # self.sigmoid = nn.Sigmoid()

    # Weight initialization scheme described in paper
    nn.init.uniform_(self.h0.linear.weight, -0.005, 0.005)
    nn.init.zeros_(self.h0.linear.bias)
    nn.init.uniform_(self.h1.linear.weight, -0.005, 0.005)
    nn.init.zeros_(self.h1.linear.bias)
    nn.init.uniform_(self.fc3.weight, -0.005, 0.005)
    nn.init.zeros_(self.fc3.bias)

  def forward(self, x):
    out = self.h0(x)
    out = self.h1(out)
    out = self.fc3(out)
    # out = self.sigmoid(out)
    return out
{% endhighlight %}
</details>

<details>
<summary><b>View Training and Test Loop</b></summary>
{% highlight python %}
# Load the data
normalize_transform = transforms.ToTensor()
train_dataset = datasets.MNIST(root='./data', train=True, download=True, transform=normalize_transform)
test_dataset = datasets.MNIST(root='./data', train=False, download=True, transform=normalize_transform)

# ---------- Training Setup ----------
device = "cuda" if torch.cuda.is_available() else "cpu"

g = torch.Generator().manual_seed(42)
train_ds, val_ds = random_split(train_dataset, [50_000, 10_000], generator=g)

train_loader = DataLoader(train_ds, batch_size=100, shuffle=True,
                          num_workers=2, pin_memory=True)
val_loader   = DataLoader(val_ds,   batch_size=100, shuffle=False,
                          num_workers=2, pin_memory=True)

z_dim = 100
z_fixed = torch.empty(64, z_dim, device=device).uniform_(-1.0, 1.0)

G = Generator(z_dim=z_dim).to(device)
D = Discriminator().to(device)

criterion = nn.BCEWithLogitsLoss()
G_optimizer = torch.optim.SGD(G.parameters(), lr=0.001,  momentum=0.5)
D_optimizer = torch.optim.SGD(D.parameters(), lr=0.0005, momentum=0.5)

smooth_real = 0.9

# ---------- History for plotting ----------
train_loss_D_hist, val_loss_D_hist = [], []
train_loss_G_hist, val_loss_G_hist = [], []
train_Dreal_hist, val_Dreal_hist   = [], []

epochs = 125
for epoch in range(epochs):
    G.train(); D.train()

    epoch_loss_D = 0.0
    epoch_loss_G = 0.0
    epoch_Dreal  = 0.0
    epoch_Dfake  = 0.0
    nbatches = 0

    # ======= TRAIN LOOP =======
    for imgs, _ in train_loader:
        nbatches += 1
        B = imgs.size(0)

        imgs = imgs.to(device, non_blocking=True)
        data_samples = imgs.view(B, -1)

        # ----- Discriminator step -----
        z = torch.empty(B, z_dim, device=device).uniform_(-1.0, 1.0)
        generated_samples = G(z).detach()
        D_x = D(data_samples)
        D_g = D(generated_samples)

        reals = torch.full((B, 1), smooth_real, device=device)
        fakes = torch.zeros(B, 1, device=device)

        loss_D = criterion(D_x, reals) + criterion(D_g, fakes)

        D_optimizer.zero_grad()
        loss_D.backward()
        torch.nn.utils.clip_grad_norm_(D.parameters(), max_norm=10.0)
        D_optimizer.step()

        # ----- Generator step (non-saturating) -----
        z = torch.empty(B, z_dim, device=device).uniform_(-1.0, 1.0)
        generated_samples = G(z)
        D_g_z = D(generated_samples)
        loss_G = criterion(D_g_z, torch.ones(B, 1, device=device))

        G_optimizer.zero_grad()
        loss_G.backward()
        torch.nn.utils.clip_grad_norm_(G.parameters(), max_norm=10.0)
        G_optimizer.step()

        # logging accumulators
        epoch_loss_D += loss_D.item()
        epoch_loss_G += loss_G.item()
        epoch_Dreal  += torch.sigmoid(D_x).mean().item()
        epoch_Dfake  += torch.sigmoid(D_g).mean().item()

    # averages over training batches
    avg_loss_D = epoch_loss_D / nbatches
    avg_loss_G = epoch_loss_G / nbatches
    avg_Dreal  = epoch_Dreal  / nbatches
    avg_Dfake  = epoch_Dfake  / nbatches

    train_loss_D_hist.append(avg_loss_D)
    train_loss_G_hist.append(avg_loss_G)
    train_Dreal_hist.append(avg_Dreal)

    # ======= VALIDATION LOOP =======
    G.eval(); D.eval()
    val_loss_D = 0.0
    val_loss_G = 0.0
    val_Dreal  = 0.0
    n_val_batches = 0

    with torch.no_grad():
        for val_imgs, _ in val_loader:
            n_val_batches += 1
            Bv = val_imgs.size(0)
            val_real = val_imgs.to(device, non_blocking=True).view(Bv, -1)

            z = torch.empty(Bv, z_dim, device=device).uniform_(-1.0, 1.0)
            val_fake = G(z)

            D_x_val = D(val_real)
            D_g_val = D(val_fake)

            reals_v = torch.ones(Bv, 1, device=device)
            fakes_v = torch.zeros(Bv, 1, device=device)

            loss_D_val = criterion(D_x_val, reals_v) + criterion(D_g_val, fakes_v)
            loss_G_val = criterion(D_g_val, torch.ones(Bv, 1, device=device))

            val_loss_D += loss_D_val.item()
            val_loss_G += loss_G_val.item()
            val_Dreal  += torch.sigmoid(D_x_val).mean().item()

        val_loss_D /= n_val_batches
        val_loss_G /= n_val_batches
        val_Dreal   /= n_val_batches

    val_loss_D_hist.append(val_loss_D)
    val_loss_G_hist.append(val_loss_G)
    val_Dreal_hist.append(val_Dreal)

    print(
        f"Epoch {epoch+1:03d} | "
        f"train_loss_D={avg_loss_D:.3f} | val_loss_D={val_loss_D:.3f} | "
        f"train_loss_G={avg_loss_G:.3f} | val_loss_G={val_loss_G:.3f} | "
        f"val D(real)={val_Dreal:.3f} | train D(real)={avg_Dreal:.3f}"
    )

# ================== PLOTTING ==================

epochs_axis = range(1, epochs + 1)

# Discriminator loss
plt.figure(figsize=(6,4))
plt.plot(epochs_axis, train_loss_D_hist, label="Train D loss")
plt.plot(epochs_axis, val_loss_D_hist,   label="Val D loss")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.title("Discriminator Loss")
plt.legend()
plt.grid(True)

# Generator loss
plt.figure(figsize=(6,4))
plt.plot(epochs_axis, train_loss_G_hist, label="Train G loss")
plt.plot(epochs_axis, val_loss_G_hist,   label="Val G loss")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.title("Generator Loss")
plt.legend()
plt.grid(True)

# Discriminator output on real images (train vs val)
plt.figure(figsize=(6,4))
plt.plot(epochs_axis, train_Dreal_hist, label="Train D(real)")
plt.plot(epochs_axis, val_Dreal_hist,   label="Val D(real)")
plt.xlabel("Epoch")
plt.ylabel("Mean D(real)")
plt.title("Discriminator Confidence on Real Images")
plt.legend()
plt.grid(True)

plt.show()
{% endhighlight %}
</details>

<img src="/assets/article_images/2025-12-22-images/discrim_gen_loss_1.png" alt="Discriminator and Generator Loss for First GAN Implementation" title="Discriminator and Generator Loss for First GAN Implementation" width="700">

**Final epoch (125)**:
- Discriminator: training loss = 0.641, validation loss = 0.511
- Generator: training loss = 2.452, validation loss = 2.269

The Discriminator loss decreases over time and validation loss is slightly lower than training, so $$D$$ is not clearly overfitting. Meanwhile, the Generator loss rises as $$D$$ becomes stronger; $$D$$’s confidence on real images stabilizes around $$0.75$$ (better than random), consistent with a GAN approaching a dynamic equilibrium.

<img src="/assets/article_images/2025-12-22-images/discrim_confidence_1.png" alt="Discriminator Confidence on Real Images" title="Discriminator Confidence on Real Images" width="700">

**Final Epoch (125)**:
$$\mathbb{E}[D(x_{\text{real}})]_{\text{train}} \approx 0.76,\quad
  \mathbb{E}[D(x_{\text{real}})]_{\text{val}} \approx 0.75$$

- Discriminator’s average confidence on real images grows from around $$0.5$$ toward $$\approx 0.75$$ over training.
- Train and validation curves closely track each other, indicating similar performance on seen and unseen data.

<details>
<summary><b>View Generated Image Sampling Code</b></summary>
{% highlight python %}
def sample_fakes(G, n=16, z_dim=100, device="cuda", seed=None, show=True):
    """Return a tensor of n fake MNIST images shaped (n,1,28,28)."""
    if seed is not None:
        torch.manual_seed(seed)
    G.eval()
    with torch.no_grad():
        z = torch.empty(n, z_dim, device=device).uniform_(-1, 1)
        x = G(z).view(n, 1, 28, 28).cpu()   # in [0,1]
    if show:
        cols = int(min(8, n))
        rows = int((n + cols - 1) // cols)
        fig, axes = plt.subplots(rows, cols, figsize=(cols*1.5, rows*1.5))
        axes = axes.ravel() if n > 1 else [axes]
        for i in range(rows*cols):
            axes[i].axis("off")
            if i < n:
                axes[i].imshow(x[i,0], cmap="gray")
        plt.tight_layout()
    return x  # tensor shape: (n,1,28,28)

# Example:
fakes = sample_fakes(G, n=32, z_dim=100, device=device, seed=123, show=True)

# --- FID metric ---
# feature=2048 uses the last pooling layer of InceptionV3 (standard FID setup)
fid = FrechetInceptionDistance(feature=2048).to(device)

val_loader_fid = DataLoader(
    val_ds, batch_size=128, shuffle=False, num_workers=2, pin_memory=True
)

# Helper: convert MNIST (B,1,28,28) in [-1,1] -> (B,3,299,299) in uint8 [0,255]
def preprocess_for_fid(x):
    # If x is in [-1,1], map to [0,1]; if it's already [0,1], this is still safe
    x = (x + 1) / 2.0 # -> [0,1], float32
    x = x.clamp(0.0, 1.0)
    x = x.repeat(1, 3, 1, 1)  # 1 channel -> 3 channels (B,3,28,28)
    x = F.interpolate(
        x, size=(299, 299),
        mode="bilinear", align_corners=False
    ) # (B,3,299,299)
    x = (x * 255.0).clamp(0, 255)
    x = x.to(torch.uint8) # dtype uint8 as required by torch-fidelity
    return x

# ---------- 1) Feed validation images as "real" ----------
fid.reset()
with torch.no_grad():
    for imgs, _ in val_loader_fid:
        imgs = imgs.to(device)
        imgs = preprocess_for_fid(imgs)
        fid.update(imgs, real=True)

# ---------- 2) Feed fake images from trained G ----------
G.eval()
n_fake = len(val_ds) # same number of fakes as real val images
batch_size = 128
steps = (n_fake + batch_size - 1) // batch_size

with torch.no_grad():
    for _ in range(steps):
        B = min(batch_size, n_fake)
        z = torch.empty(B, z_dim, device=device).uniform_(-1.0, 1.0)
        fake_flat = G(z)                     # (B, 784)
        fake_imgs = fake_flat.view(B, 1, 28, 28)
        fake_imgs = preprocess_for_fid(fake_imgs)
        fid.update(fake_imgs, real=False)
        n_fake -= B
        if n_fake <= 0:
            break

# ---------- 3) Compute FID on validation set ----------
fid_score_val = fid.compute().item()
print("Validation FID:", fid_score_val)
{% endhighlight %}
</details>

<img src="/assets/article_images/2025-12-22-images/generated_samples_1.png" alt="Generated Samples (Vanilla GAN)" title="Generated Samples (Vanilla GAN)" width="700">

**Validation FID (Inception-based):** 276.31

Notably, the generated synthetic MNIST digits in the Vanilla GAN implementation are, uh, pretty terrible. The <a href="https://en.wikipedia.org/wiki/Fr%C3%A9chet_inception_distance">FID score</a> is extremely high (near 300), and even just visually, the generated images look grainy, blurry, and low-quality. In fairness, there is *some* resemblance to handwritten digits, but the generated samples are very noisy, suggesting the GAN is struggling to model the data distribution well. (How the authors got this implementation to work in their paper, I don't know.)


### Model Implementation 2: My Custom Modifications

I made some small, yet significantly performance-enhancing, modifications to the original model architecture choices. (I wish I could tell you which changes specifically led to what improvements [I have a hunch though], but I kinda just changed a bunch of things and hoped it would work. If you want to do a more rigorous ablation, feel free to rip the code.)

First, I changed the activation output from sigmoid to tanh. This likely did absolutely nothing to change performance since tanh is essentially just a rescaled sigmoid, but most GANs in the literature are implemented with tanh, so I made this change just for consistency with that. I also re-normalized the MNIST pixels to be between $$[-1, 1]$$ instead of $$(0, 1)$$ accordingly, since we want the Generator output range to match the data range so the Discriminator sees inputs on the same scale and gradients stay well-behaved.

One change which I suspect made a significant difference was switching to the Adam optimizer from SGD, for more stable and faster convergence. I also added Gaussian instance noise to real/fake inputs (decayed over epochs) to smooth the decision boundary and reduce early overfitting by the Discriminator.

The last big change I made was *dynamic Generator updates*. During training, if $$D(\text{real})$$ is high and $$D(\text{fake})$$ is very low, we treat the Discriminator as "too strong" and give the Generator an extra update step ($$k{=}2$$ instead of $$k{=}1$$). This *dynamic G step* helps keep $$G$$ and $$D$$ more balanced, preventing the Discriminator from overpowering the Generator and providing more useful gradients for the Generator to improve.

<details>
<summary><b>View Dependencies</b></summary>
{% highlight python %}
class Maxout(nn.Module):
  def __init__(self, in_features, out_features, num_pieces=5, bias=True):
    super().__init__()
    self.out_features = out_features
    self.num_pieces = num_pieces
    self.linear = nn.Linear(in_features, out_features * num_pieces, bias=bias)

  def forward(self, x):
    B = x.shape[0]
    x = self.linear(x)
    x = x.view(B, self.out_features, self.num_pieces)
    x = x.max(dim=2).values
    return x

class Generator(nn.Module):
  def __init__(self, z_dim, img_dim=784):
    super().__init__()
    self.fc1 = nn.Linear(z_dim, 1200)
    self.relu = nn.ReLU()
    self.fc2 = nn.Linear(1200, 1200)
    self.fc3 = nn.Linear(1200, img_dim)

    # CHANGED: tanh for [-1,1] pixels
    self.tanh = nn.Tanh()

    nn.init.uniform_(self.fc1.weight, -0.05, 0.05); nn.init.zeros_(self.fc1.bias)
    nn.init.uniform_(self.fc2.weight, -0.05, 0.05); nn.init.zeros_(self.fc2.bias)
    nn.init.uniform_(self.fc3.weight, -0.05, 0.05); nn.init.zeros_(self.fc3.bias)

  def forward(self, z):
    out = self.fc1(z); out = self.relu(out)
    out = self.fc2(out); out = self.relu(out)
    out = self.fc3(out)

    # CHANGED: tanh for [-1,1] pixels
    out = self.tanh(out)
    return out

class Discriminator(nn.Module):
  def __init__(self, num_units=240, img_dim=784, num_pieces=5):
    super().__init__()
    self.h0 = Maxout(img_dim, num_units, num_pieces)
    self.h1 = Maxout(num_units, num_units, num_pieces)
    self.fc3 = nn.Linear(num_units, 1)  # logits

    nn.init.uniform_(self.h0.linear.weight, -0.005, 0.005); nn.init.zeros_(self.h0.linear.bias)
    nn.init.uniform_(self.h1.linear.weight, -0.005, 0.005); nn.init.zeros_(self.h1.linear.bias)
    nn.init.uniform_(self.fc3.weight,       -0.005, 0.005); nn.init.zeros_(self.fc3.bias)

  def forward(self, x):
    out = self.h0(x)
    out = self.h1(out)
    out = self.fc3(out)
    return out

# CHANGED: Normalize MNIST from [0,1] -> [-1,1] to match G's tanh output
normalize_transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])
train_dataset = datasets.MNIST(root='./data', train=True,  download=True, transform=normalize_transform)
test_dataset  = datasets.MNIST(root='./data', train=False, download=True, transform=normalize_transform)

device = "cuda" if torch.cuda.is_available() else "cpu"

g = torch.Generator().manual_seed(42)
train_ds, val_ds = random_split(train_dataset, [50_000, 10_000], generator=g)

train_loader = DataLoader(train_ds, batch_size=100, shuffle=True,  num_workers=2, pin_memory=True)
val_loader   = DataLoader(val_ds,   batch_size=100, shuffle=False, num_workers=2, pin_memory=True)

z_dim = 100
z_fixed = torch.empty(64, z_dim, device=device).uniform_(-1.0, 1.0)

G = Generator(z_dim=z_dim).to(device)
D = Discriminator().to(device)

criterion = nn.BCEWithLogitsLoss()

# CHANGED: Adam optimizer instead of SGD; tuned betas
G_optimizer = torch.optim.Adam(G.parameters(), lr=2e-4, betas=(0.5, 0.999))
D_optimizer = torch.optim.Adam(D.parameters(), lr=2e-4, betas=(0.5, 0.999))


smooth_real = 0.9
epochs = 100

# CHANGED: Instance noise (stabilizes early training); decay to 0 by epoch 40
def add_instance_noise(x, sigma):
  if sigma <= 0:
    return x
  noise = torch.randn_like(x) * sigma
  return x + noise

train_loss_D_hist = []
val_loss_D_hist   = []
train_loss_G_hist = []
val_loss_G_hist   = []
train_Dreal_hist  = []
val_Dreal_hist    = []

for epoch in range(epochs):
  G.train(); D.train()

  epoch_loss_D = 0.0
  epoch_loss_G = 0.0
  epoch_Dreal  = 0.0
  epoch_Dfake  = 0.0
  nbatches = 0

  # CHANGED: schedule for smoothing & noise
  real_target_val = smooth_real if epoch < 10 else 1.0                     # EDIT
  inst_sigma = max(0.0, 0.1 * (1.0 - min(epoch, 40)/40.0))                 # EDIT

  for imgs, _ in train_loader:
    nbatches += 1
    B = imgs.size(0)

    imgs = imgs.to(device, non_blocking=True)
    data_samples = imgs.view(B, -1)

    # ===== Discriminator =====
    z = torch.empty(B, z_dim, device=device).uniform_(-1.0, 1.0)
    generated_samples = G(z).detach()

    # CHANGED: add instance noise to both real and fake before D
    d_real_in = add_instance_noise(data_samples, inst_sigma)                # EDIT
    d_fake_in = add_instance_noise(generated_samples, inst_sigma)           # EDIT

    D_x = D(d_real_in)
    D_g = D(d_fake_in)

    reals = torch.full((B, 1), real_target_val, device=device)
    fakes = torch.zeros(B, 1, device=device)

    loss_D = criterion(D_x, reals) + criterion(D_g, fakes)

    D_optimizer.zero_grad()
    loss_D.backward()
    D_optimizer.step()

    # ===== Generator (non-saturating) =====
    # If D is too confident, give G an extra step this batch
    with torch.no_grad():
      D_fake_mean_batch = torch.sigmoid(D_g).mean().item()
      D_real_mean_batch = torch.sigmoid(D_x).mean().item()
    k = 2 if (D_fake_mean_batch < 0.30 and D_real_mean_batch > 0.80) else 1

    for _ in range(k):
      z = torch.empty(B, z_dim, device=device).uniform_(-1.0, 1.0)
      generated_samples = G(z)
      d_gen_in = add_instance_noise(generated_samples, inst_sigma)
      D_g_z = D(d_gen_in)

      loss_G = criterion(D_g_z, torch.ones(B, 1, device=device))

      G_optimizer.zero_grad()
      loss_G.backward()
      G_optimizer.step()

    epoch_loss_D += loss_D.item()
    epoch_loss_G += loss_G.item()
    epoch_Dreal  += torch.sigmoid(D_x).mean().item()
    epoch_Dfake  += torch.sigmoid(D_g).mean().item()

  # ----- epoch-end eval -----
  avg_loss_D = epoch_loss_D / nbatches
  avg_loss_G = epoch_loss_G / nbatches
  avg_Dreal  = epoch_Dreal  / nbatches
  avg_Dfake  = epoch_Dfake  / nbatches

  G.eval(); D.eval()
  with torch.no_grad():
    val_loss_D = 0.0
    val_loss_G = 0.0
    val_Dreal  = 0.0
    val_batches = 0

    for val_imgs, _ in val_loader:
      val_batches += 1
      val_B = val_imgs.size(0)
      val_real = val_imgs.to(device, non_blocking=True).view(val_B, -1)

      z_val  = torch.empty(val_B, z_dim, device=device).uniform_(-1.0, 1.0)
      val_fake = G(z_val)

      D_x_val = D(val_real)
      D_g_val = D(val_fake)

      reals_val = torch.ones(val_B, 1, device=device)
      fakes_val = torch.zeros(val_B, 1, device=device)

      loss_D_val = criterion(D_x_val, reals_val) + criterion(D_g_val, fakes_val)
      loss_G_val = criterion(D_g_val, torch.ones(val_B, 1, device=device))

      val_loss_D += loss_D_val.item()
      val_loss_G += loss_G_val.item()
      val_Dreal  += torch.sigmoid(D_x_val).mean().item()

    val_loss_D /= val_batches
    val_loss_G /= val_batches
    val_Dreal  /= val_batches

    print(
      f"Epoch {epoch+1:03d} | "
      f"train_loss_D={avg_loss_D:.3f} | val_loss_D={val_loss_D:.3f} | "
      f"train_loss_G={avg_loss_G:.3f} | val_loss_G={val_loss_G:.3f} | "
      f"train D(real)={avg_Dreal:.3f} | val D(real)={val_Dreal:.3f}"
    )

    # NEW: store history
    train_loss_D_hist.append(avg_loss_D)
    val_loss_D_hist.append(val_loss_D)
    train_loss_G_hist.append(avg_loss_G)
    val_loss_G_hist.append(val_loss_G)
    train_Dreal_hist.append(avg_Dreal)
    val_Dreal_hist.append(val_Dreal)

  G.train(); D.train()

# ---------- PLOTS ----------

epochs_range = range(1, epochs + 1)

# 1) Discriminator loss
plt.figure(figsize=(6,4))
plt.plot(epochs_range, train_loss_D_hist, label="Train D loss")
plt.plot(epochs_range, val_loss_D_hist,   label="Val D loss")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.title("Discriminator Loss (train vs val)")
plt.legend()
plt.tight_layout()
plt.show()

# 2) Generator loss
plt.figure(figsize=(6,4))
plt.plot(epochs_range, train_loss_G_hist, label="Train G loss")
plt.plot(epochs_range, val_loss_G_hist,   label="Val G loss")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.title("Generator Loss (train vs val)")
plt.legend()
plt.tight_layout()
plt.show()

# 3) Discriminator confidence on real images
plt.figure(figsize=(6,4))
plt.plot(epochs_range, train_Dreal_hist, label="Train E[D(real)]")
plt.plot(epochs_range, val_Dreal_hist,   label="Val E[D(real)]")
plt.xlabel("Epoch")
plt.ylabel("D(real) probability")
plt.ylim(0, 1)
plt.title("Discriminator Confidence on Real Images")
plt.legend()
plt.tight_layout()
plt.show()
{% endhighlight %}
</details>

<img src="/assets/article_images/2025-12-22-images/discrim_gen_loss_2.png" alt="Discriminator and Generator Loss for My Modified GAN Implementation" title="Discriminator and Generator Loss for My Modified GAN Implementation" width="700">

**Final epoch (100):**
- Discriminator: training loss = 0.751, validation loss = 1.232
- Generator: training loss = 1.955, validation loss = 1.947

- As training progresses, the Discriminator's training loss steadily decreases while the validation loss hovers around a higher plateau, indicating that $$D$$ becomes quite strong and may start to specialize to the training set.
- The Generator's loss gradually increases against this stronger Discriminator (consistent with adversarial game: $$G$$ must keep improving to fool $$D$$ despite the discriminator maintaining relatively high accuracy)

<img src="/assets/article_images/2025-12-22-images/discrim_confidence_2.png" alt="My Custom Discriminator Confidence on Real Images" title="My Custom Discriminator Confidence on Real Images" width="700">

**Final epoch (100):** $$\mathbb{E}[D(x_{\text{real}})]_{\text{train}} \approx 0.751,\quad \mathbb{E}[D(x_{\text{real}})]_{\text{val}} \approx 0.562$$

- Over training, $$D$$'s confidence on real images increases on the training set ($$\approx 0.75$$), while on the validation set it stays closer to $$0.5$$mark
- Recall $$D^*(x)=0.5$$, so the validation curve staying nearer to $$0.5$$ can be interpreted as a sign that generated samples are becoming more realistic relative to held-out data.

<details>
<summary><b>View Generated Image Sampling Code</b></summary>
{% highlight python %}
def sample_fakes(G, n=16, z_dim=16, device="cuda", seed=None, show=True):
    """Return a tensor of n fake MNIST images shaped (n,1,28,28)."""
    if seed is not None:
        torch.manual_seed(seed)
    G.eval()
    with torch.no_grad():
        z = torch.empty(n, z_dim, device=device).uniform_(-1, 1)
        x = G(z).view(n, 1, 28, 28).cpu()   # in [0,1]
    if show:
        cols = int(min(8, n))
        rows = int((n + cols - 1) // cols)
        fig, axes = plt.subplots(rows, cols, figsize=(cols*1.5, rows*1.5))
        axes = axes.ravel() if n > 1 else [axes]
        for i in range(rows*cols):
            axes[i].axis("off")
            if i < n:
                axes[i].imshow(x[i,0], cmap="gray")
        plt.tight_layout()
    return x  # tensor shape: (n,1,28,28)

# Example:
fakes = sample_fakes(G, n=32, z_dim=100, device=device, seed=123, show=True)

# --- FID metric ---
# feature=2048 uses the last pooling layer of InceptionV3 (standard FID setup)
fid = FrechetInceptionDistance(feature=2048).to(device)

normalize_transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

test_dataset = datasets.MNIST(root="./data", train=False, download=True,
                              transform=normalize_transform)
test_loader = DataLoader(test_dataset, batch_size=128, shuffle=False,
                         num_workers=2, pin_memory=True)

# Helper: convert MNIST (B,1,28,28) in [-1,1] -> (B,3,299,299) in [0,1]
def preprocess_for_fid(x):
    # x is in [-1,1] from tanh / Normalize(0.5,0.5)
    x = (x + 1) / 2.0                      # -> [0,1], float32
    x = x.repeat(1, 3, 1, 1)               # 1 channel -> 3 channels (B,3,28,28)
    x = F.interpolate(
        x, size=(299, 299),
        mode="bilinear", align_corners=False
    )                                      # still float in [0,1]
    x = (x * 255.0).clamp(0, 255)          # -> [0,255]
    x = x.to(torch.uint8)                  # dtype uint8 as required
    return x

# ---------- 1) Feed real images ----------
with torch.no_grad():
    for imgs, _ in test_loader:
        imgs = imgs.to(device)
        imgs = preprocess_for_fid(imgs)
        fid.update(imgs, real=True)

# ---------- 2) Feed fake images from G ----------
G.eval()
n_fake = len(test_dataset)        # e.g. same number as real test images
batch_size = 128
steps = (n_fake + batch_size - 1) // batch_size

with torch.no_grad():
    for _ in range(steps):
        B = min(batch_size, n_fake)
        z = torch.empty(B, z_dim, device=device).uniform_(-1.0, 1.0)
        fake_flat = G(z)                       # (B, 784) in [-1,1] because tanh
        fake_imgs = fake_flat.view(B, 1, 28, 28)
        fake_imgs = preprocess_for_fid(fake_imgs)
        fid.update(fake_imgs, real=False)
        n_fake -= B
        if n_fake <= 0:
            break

# ---------- 3) Compute FID ----------import torch
import torch.nn.functional as F
from torch.utils.data import DataLoader
import importlib
import torchmetrics.image.fid as tm_fid
importlib.reload(tm_fid)  # forces it to re-check for torch_fidelity
from torchmetrics.image.fid import FrechetInceptionDistance

device = "cuda" if torch.cuda.is_available() else "cpu"

# --- FID metric ---
# feature=2048 uses the last pooling layer of InceptionV3 (standard FID setup)
fid = FrechetInceptionDistance(feature=2048).to(device)

# val_ds, z_dim and G are assumed to come from training code
val_loader_fid = DataLoader(
    val_ds, batch_size=128, shuffle=False, num_workers=2, pin_memory=True
)

# Helper: convert MNIST (B,1,28,28) in [-1,1] -> (B,3,299,299) uint8 in [0,255]
def preprocess_for_fid(x):
    # x is in [-1,1] from tanh / Normalize(0.5,0.5)
    x = (x + 1) / 2.0                      # -> [0,1], float32
    x = x.repeat(1, 3, 1, 1)               # 1 channel -> 3 channels (B,3,28,28)
    x = F.interpolate(
        x, size=(299, 299),
        mode="bilinear", align_corners=False
    )                                      # still float in [0,1]
    x = (x * 255.0).clamp(0, 255)          # -> [0,255]
    x = x.to(torch.uint8)                  # dtype uint8 as required
    return x

# ---------- 1) Feed real validation images ----------
with torch.no_grad():
    for imgs, _ in val_loader_fid:
        imgs = imgs.to(device)
        imgs = preprocess_for_fid(imgs)
        fid.update(imgs, real=True)

# ---------- 2) Feed fake images from G ----------
G.eval()
n_fake = len(val_ds) # same number as real val images
batch_size = 128
steps = (n_fake + batch_size - 1) // batch_size

with torch.no_grad():
    for _ in range(steps):
        B = min(batch_size, n_fake)
        z = torch.empty(B, z_dim, device=device).uniform_(-1.0, 1.0)
        fake_flat = G(z) # (B, 784) in [-1,1] because tanh
        fake_imgs = fake_flat.view(B, 1, 28, 28)
        fake_imgs = preprocess_for_fid(fake_imgs)
        fid.update(fake_imgs, real=False)
        n_fake -= B
        if n_fake <= 0:
            break

# ---------- 3) Compute FID ----------
fid_score = fid.compute().item()
print("Validation FID:", fid_score)

fid_score = fid.compute().item()
print("FID:", fid_score)
{% endhighlight %}
</details>

<img src="/assets/article_images/2025-12-22-images/generated_samples_2.png" alt="Generated Samples (Modified GAN)" title="Generated Samples (Modified GAN)" width="700">

**Validation FID (Inception-based):** 45.903

These generated images are MUCH better, both quantitatively (lower FID score) and qualitatively (I mean, just look at them).

## Some Extensions

There are some extensions of the vanilla GAN architecture, which has some limitations. Most notably, GANs have no means of learning the inverse mapping projecting data back into the latent space. For that, the **BiGAN** architecture can be used for unsupervised learning of rich feature representations for arbitrary data distributions, by including an encoder $$E$$ that maps data $$x$$ to latent distribution $$z$$. Also, the problem of *mode collapse* is well-documented, where the Generator begins generating a small set of nearly identical samples ("modes") that best "fool" the Discriminator, rather than capturing the full data distribution. To amend this, <a href="https://en.wikipedia.org/wiki/Wasserstein_GAN">**Wasserstein GANs**</a>, named for the use of Wasserstein (earth-mover's) distance instead of Jensen-Shannon Divergence, have been used, and they also have the advantage of mitigating vanishing gradients even when the probability distributions of real and fake data are far apart. The theory behind WGANs is a bit dense, but further reading can be found <a href="https://www.alexirpan.com/2017/02/22/wasserstein-gan.html">here</a>.

---
#### Footnotes
[^1]: <small>The authors choose $$\frac{1}{2}$$ because they always feed the Discriminator minibatches with as many real as fake examples, but it's also because having equal probabilities on each class makes the optimization problem much cleaner since you can just ignore the probability weights.</small>
[^2]: <small>For those of you unfamiliar with how Maxout works, it's essentially a generalization of ReLU to a piecewise linear input. Imagine you have an input 784-dimensional vector of pixel grayscale values, like the MNIST handwritten digits. We can choose a value of $$k$$ to "block" our input vector, e.g. at $$k = 4$$, we chunk the input vector into 196 4-dimensional vector "blocks." From each block of 4, we select the maximum element from that vector. Formally, this computes $$\text{Maxout}(x) = \max_{k = 1, ..., K} w^T_k x + b_k$$. Supposedly, Maxout activation mitigates the vanishing gradient problem, which makes sense since it's a generalization of ReLU, but I couldn't find a definitive source on this.</small>