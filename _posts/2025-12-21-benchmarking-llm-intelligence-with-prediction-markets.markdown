---
layout: post
title:  "Benchmarking LLM Intelligence with Prediction Markets"
subtitle: "A personal update on the research I've been doing!"
date:   2025-12-21 00:00:00 -0500
categories: jekyll update
---

A few months ago, I joined the SIGMA Lab at UChicago, where I'm assisting Prof. Haifeng Xu on <a href="https://www.prophetarena.co/leaderboard">Prophet Arena</a>. I've been doing research analyzing historical behavior of LLMs on prediction markets, and you can read <a href="https://www.prophetarena.co/research/stability">some of my work</a> on the research section of the website! More to follow in the future, as well.

Why have an LLM benchmark centered around forecasting capabilities? Because predictive intelligence *is* a mode of human intelligence and thinking that we use all the time – from deciding when to leave your house so you show up on time to meet your friends (or, to minimize the annoyance of the person you're meeting up with when you inevitably show up late like me), to making investing decisions on the stock market.

One problem with <a href="https://www.evidentlyai.com/llm-guide/llm-benchmarks">currently-existing LLM benchmarks</a> is that since LLMs will inevitably be trained on every last nook and cranny of the Internet, their performance on common benchmarks may reflect memorizing training data – including the benchmark questions themselves – rather than reflect true, out-of-sample reasoning, intelligence, and extrapolation. Recently, Meta wound up in <a href="https://www.zdnet.com/article/metas-llama-4-herd-controversy-and-ai-contamination-explained/">controversy over data contamination</a> in their Llama 4 release. The model crushed benchmarks but performed poorly in production and on other specialized tasks, suggesting some amount of training data memorization for benchmark questions.

Contamination issues aside, the purpose of benchmarking LLM intelligence should be centered around generalization; it's fine that LLMs are fine-tuned on specific coding or math tasks like <a hre="https://www.swebench.com/">SWEBench</a> or <a href="https://huggingface.co/datasets/openai/gsm8k">GSM8K</a>, but the idea behind *intelligence* is be that models should be capable of reasoning outside data they were explicitly trained on.[^1]

So what does Prophet Arena do differently to avoid static, contamination-prone benchmarking? Have LLMs forecast the future! Using prediction market events from Kalshi, the Prophet Arena team has been evaluating the ability of various LLMs to make well-calibrated forecasts about real-world events, ranging from sports and culture to politics and economics. Because the models are forecasting on events that take place outside the training data (the future), this benchmark avoids the data contamination issue altogether, and instead forces the LLM to aggregate information in a systematic and well-reasoned way to make a forecast. This form of "predictive intelligence" does not encapsulate "general intelligence" on its own, but it reflects genuine, out-of-sample reasoning abilities in a way that many existing static benchmarks do not.

I'd highly encourage everyone to read the <a href="https://arxiv.org/abs/2510.17638">LLM-as-a-Prophet paper</a> from my mentors and teammates at SIGMA Lab, as well as check out our <a href="https://www.prophetarena.co/leaderboard">leaderboard</a> and stay tuned for future research updates! To summarize where things currently stand, currently 8 models are outperforming the Kalshi market baseline, and the GPT-5 models seem to be the most well-calibrated on their forecasts as measured by Brier score. Despite having decent calibration metrics, none of the models are actually profitable, and have lost anywhere from 10 to 20% of their initial purse.

I'll periodically post updates/research posts that I write for Prophet Arena on here. Excited to be part of this project and see where it goes in the future!

---
#### Footnotes
[^1]: <small>And to be fair, we genuinely have made a lot of progress on coding and math for LLMs, including <a href="https://arxiv.org/abs/2507.15855">winning gold at the IMO</a> and <a href="https://deepmind.google/blog/gemini-achieves-gold-medal-level-at-the-international-collegiate-programming-contest-world-finals/">ICPC</a> competitions earlier this year. Anecdotally, I've observed substantial improvement in ChatGPT's math and coding abilities since 2024.</small>