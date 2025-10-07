---
layout: post
title:  "So You Want to be a Stats Major"
subtitle: "Some tips from a former Berkeley statistics and data science major"
date:   2025-09-04 11:30:26 -0700
categories: jekyll update
---

**Table of contents:**
[A Little Prelude (Feel Free to Skip)](#a-little-prelude-feel-free-to-skip) | [The Non-Negotiable Lower Divs](#the-non-negotiable-lower-divs) | [The Non-Negotiable Upper Divs](#the-non-negotiable-upper-divs) | [So You Want to be a Quant Trader](#so-you-want-to-be-a-quant-trader) | [So You Want to be a Data Scientist (or Engineer, or Analyst...)](#so-you-want-to-be-a-data-scientist-or-engineer-or-analyst) | [So You Want to be a Machine Learning Engineer](#so-you-want-to-be-a-machine-learning-engineer) | [So You Want to go to Grad School](#so-you-want-to-go-to-grad-school) | [Closing Thoughts](#closing-thoughts)

I am currently on a plane heading to Korea! With 11 hours to kill (well, more like 5 now), I thought I'd take the time to write a blogpost.

## A Little Prelude (Feel Free to Skip)

It's hard for me to pinpoint when exactly I decided to be a statistics major, but in retrospect, there were always signs when I was growing up that working with data was the right fit for me.

My favorite unit in 8th grade algebra was the unit on linear regression, and our textbook used a fictionalized version of the 1996 Chicago Bulls roster to introduce basic descriptive statistics and regression analysis to us.[^1]

I think introducing statistics through the lens of sports (specifically basketball) was perfect for me, and I remember scouring Basketball Reference and other sports databases early in high school to win arguments in the Reddit and YouTube comments sections. (I was mostly cherry-picking and abusing statistics to fit my desired agenda, but that's how it goes in sports-world.)

I also generally had an affinity for my math classes in grade school (although I was never as cracked as the real upper echelon of math nerds), completing algebra and precalculus by the end of my freshman year of high school and taking two years of AP Calculus thereafter. I also took AP Stats my junior year, and while I definitely did not fully internalize much of the class (specifically anything on probability or statistical distributions), I absolutely *loved* the units on hypothesis testing, and I felt like it gave me a way to properly analyze data with requisite statistical scrutiny.

So it's kind of strange that despite my general inclination towards data analysis, I wanted to be a business major for the longest time in high school. The reason is both fairly simple and fairly stupid; one of my best friends in high school, who was a year older than me, wanted to major in business and finance, and because I looked up to him, I wanted to copy everything he did, so I, too, proudly proclaimed my ambitions to major in business.

Now, truthfully, I had no actual interest in business – I thought it was boring and not sufficiently technical, and I don't think I really have the mindset or brain wiring to succeed in the field anyway. I also did not know (and still don't really know) jackshit about finance or stock trading, which was seemingly the only technical part of business that seemed worth learning but I never could quite wrap my head around investing (nor did I really take the time to). However, the one happy accident that came from my detour into business was that "economics" seemed fun to me. I was a little bit of an annoying free market fundamentalist in high school, and I liked the arguments that economics equipped me with to push back on the socialist pet policies espoused by some of my peers.[^2] Around this time, I was also following the Democratic primaries, so the pop-econ background was a useful framework to analyze which candidates' policies I agreed and disagreed with.

This prompted me to email an economics professor at San Jose State to ask what his opinions were on some of the proposed policies. Honestly, I did not give a hard glance at this professor's background (I think I emailed three professors and this was the only one who responded), but by a stroke of sheer luck, he was the university's econometrics professor and was working on a book project targeted towards undergraduates to teach how to do policy impact analysis using census data in R. (Again, I cannot stress enough how dumb of me it was not to check his background beforehand, and the fact that I got the response I did was pure coincidence.) I ended up reading through his book pre-print and replicating some of the econometric studies over the summer, and I decided that this was exactly what I wanted to do in college: analyze economic data to conduct causal inference for policy evaluation.

I started off as a data science and economics major, but after my sophomore year, I decided I didn't really care as much about economics[^3] as a whole even though I really liked econometrics. So, I decided to just swap out all my planned econ classes for stats classes, and I became a statistics and data science double major.

What exactly was the point of this long intro which has very little to with the actual content of the article? Well, I think the first prerequisite of deciding whether or not to become a statistics major is to figure out whether or not you actually *like* statistics. For me, even that wasn't super clear as far as two years into college, but I figured it out eventually.

To decide whether to become a statistics major is really to work backwards from what your intended goals and interests are, and to see whether statistics is the right fit to accomplish said goals. I came into college wanting to do an Econ PhD, and statistics would have been helpful for a lot of the nitty-gritty econometrics research I so badly wanted to do. Even as I pivoted my career goals slightly to being more industry DS/ML-focused, statistics was still a very useful major, so my base interests did not really change.

All this being said, I'll try my best in this article to give general guidance of where statistics can be helpful as a major depending on your goals. I'd like to preface that I'll be framing most of this article in terms of Berkeley's curriculum, but if you don't go to Berkeley, just plug-in your own school's corresponding courses to make your best judgments.

## The Non-Negotiable Lower Divs

The best statistics majors are the ones who are actually good at math.

This seems very silly to say, but I think it's very easy to skimp on lower division math classes which can end up hurting your mathematical maturity down the road. One of the complaints I have with Berkeley's data science major (although not Berkeley's statistics major) is the complete dearth of mathematical training beyond calculus and linear algebra. To be clear, those are two very, VERY important classes, but the idea of letting someone major in what should be a mathematically-heavy subject with literally zero multivariable calculus or discrete/proof-based math, is, uh, very stupid in my opinion!

So my first piece of advice is not to rush the math foundation. Take calculus 1, 2, and 3, take linear algebra, take discrete math. Even if not all of them are required, take all of them anyway. Whether or not you take any math classes after the intro sequence depends on your goals, but I feel the math lower-divs are non-negotiable. Personally, I never took a discrete math class, and I feel as though it significantly hampered my mathematical maturity and made my proof-based statistics and probability courses much more challenging than they needed to be. In particular, I think some proper combinatorics and basic probability exposure that I would have gotten in a discrete math class would have significantly reduced my learning curve in upper-division probability.

The second non-negotiable class is obviously an introductory statistics class. Berkeley is a bit unorthodox in this sense, because there's both the introductory statistics class Stat 20, which is similar to (and even a little better than) most intro stats courses across various schools, and the introductory data science class Data 8, which focuses more on honing computational and conceptual fundamentals rather than throwing 5 different statistical tests at you and make you memorize a flowchart of when to use them like AP Stats. Personally, I think Berkeley's Data 8 is a pedagogical masterpiece, and I like the fact that they don't just rush into teaching flowchart-style, rote memorization-heavy hypothesis testing and instead focus on the intuition of why it works through bootstrap simulation. So if you have a variant of this class at your school, I'd highly recommend!

The final non-negotiable for me is taking a computer science course. Unless you're dead-set on doing a theory-heavy statistics PhD, you're going to be a LOT worse off if you don't develop an actually employable skill for industry data science/analyst positions. A lot of stats curricula will just make you learn functional programming in R, or "programming for data science" using R and Python's pandas library; these are fine skills to have, but they're insufficient, in my opinion. Lots of data science interviews will still use the same Leetcode-style data structures and algorithms questions that prospective software engineers are given, and you don't want to be at a disadvantage because you either didn't take a data structures course or you didn't really pay much attention in yours (I fall into the latter category, so don't be like me). In addition to DSA, taking a databases class also falls under the "non-negotiables" category if you want to do industry. SQL interviews are a staple of industry data science recruiting, and having at least intermediate SQL competence will make finding a job a lot easier (get ready to learn StrataScratch, buddy).

## The Non-Negotiable Upper Divs

Probability, statistics, and linear models.

It almost seems like a no-brainer that a statistics major should take probability and statistics. And it is! You probably won't be allowed to graduate if you don't take an upper division probability and mathematical statistics course.

But take them seriously when you are in those courses. Seriously, if your probability fundamentals are bad, you're going to be in a world of pain in your future statistics coursework. Additionally, much of the important intuition in mathematical statistics comes from having a deep understanding of probability, so if you don't take probability seriously, your weaknesses will compound in future coursework that depends on it.

I'm throwing in linear models as my third non-negotiable class. I debated whether I should treat it as a requirement for stats majors, but after doing data science recruiting for Master's level positions, I cannot stress the importance of knowing how regression actually works. There's a reason basically every graduate statistics program in the country requires its students to take linear models[^4], and as ryxcommar once said, even in a world where everyone wants to be a deep learning gangsta, "people don’t understand how even the simplest algorithm (OLS / linear regression) works at a strong level."

Even if your goal is to be an ML engineer where having a more developed computational background is more important than having a strong statistics background, linear models courses are typically very heavy in linear algebra, probability, and convex optimization. There's a reason linear regression is taught (at least in passing) even in introductory machine learning and deep learning courses; the intuition behind the simplest model can help inform our understanding of much more complex models. If you can't set up the least squares optimization problem and derive the OLS estimator, then good luck trying to get through backpropagation and gradient descent when you're learning about neural networks!

I've been asked some pretty tough conceptual interview questions on OLS and linear models myself recently, which is why I think this course is essentially non-negotiable. In fact, many of the other classes that tackle different statistical modeling problems (e.g. time series, causal inference) are basically just different flavors of regression.

## So You Want to be a Quant Trader

If you're interested in quantitative finance or have done quant interviews, you've probably noticed that it's essentially all just probability.

The quirk of recruiting for quant is that it's not really essential to be a statistics major to be good at probability (or the other math-y brainteasers that are asked in quant interviews). In fact, most of the people I knew at Berkeley who ended up breaking into quant *weren't* statistics majors, instead coming from applied math and computer science backgrounds.

That's because the probability questions on quant interviews are essentially their own skill that you can prepare for, much in the same way that aspiring software engineers prepare for Leetcode interviews. I did a bit of quant interview prep earlier this summer, and at a certain point, the questions become very similar to past questions you've seen and you can kind of pattern-match/intuit your way to answering them.

Of course, it helps to actually take a probability class to get good at probability, and as I mentioned before, probability is among the non-negotiable classes if you are a statistics major. (Again, mostly because it's probably required of you anyway.)

But in addition to probability, you should take a stochastic processes class if you really want to do quant.

If you're really smart, you can probably get away with taking just a probability class and figure out a lot of the stochastic process material from first(ish) principles, but I think having some formal training in stochastic processes – specifically knowing properties like convergence and recurrence, and knowing how to set up Markov chains – helps a lot, even beyond what a probability class can offer.

Here's a quant interview example question that uses stochastic processes:

> You're playing a game at an Atlantic City casino where the dealer spins a special roulette wheel with only two possible outcomes. The wheel is biased in your favor, with a 2/3 probability of landing on your number and a 1/3 probability of landing on the house's number. If the wheel lands on your number, the dealer pays you $1. If it lands on the house's number, you pay the dealer $1. You start with $1 in chips while the house starts with $2. The game continues until either you or the house goes bankrupt (has $0 left); whoever goes bankrupt loses and the other player wins. What is the probability that you win against the house?

Other than the little exposure I had to Markov chains and Poisson processes in my college probability class, I never took a class on stochastic processes, so my intuition to solve this question came more from conditional probability than setting up a stochastic process. I set up a conditional probability tree where the probability you win is

$$\frac{2}{3} \cdot \frac{2}{3} + \frac{2}{3} \cdot \frac{1}{3} \cdot \frac{2}{3} \cdot \frac{2}{3} + \frac{2}{3} \cdot \frac{1}{3} \cdot \frac{2}{3} \cdot \frac{1}{3} \cdot \frac{2}{3} \cdot \frac{2}{3} + ...$$

which is the same as

$$\sum_{m = 1}^{\infty} \left( \frac{2}{3} \cdot \frac{1}{3} \right)^{m - 1} \left( \frac{2}{3} \cdot \frac{2}{3} \right) = \frac{4}{9} \sum_{m = 0}^{\infty} \left( \frac{2}{9} \right)^m$$ where $$m$$ is the move number.

I had to use a calculator to find out this converges to $$\frac{12}{21}$$, or approximately a 57% chance of winning. However, if you instead set up the problem as a Markov chain (like my friend Mayank did) with boundary conditions $$\pi_0 = 0, \pi_3 = 1$$ and solve the system $$\begin{cases} 
      \pi_1 = \frac{1}{3} \pi_0 + \frac{2}{3} \pi_2 = \pi_2 \\
      \pi_2 = \frac{1}{3} \pi_1 + \frac{2}{3} \pi_3 = \frac{1}{3} \pi_1 + \frac{2}{3}
   \end{cases}$$

you can arrive at the solution with some basic plug-and-solve algebra and not have to worry about the big infinite sum.

This digression went on a bit longer than I intended to, but the bottom line is that taking a stochastic processes class can give you an edge on how to solve certain types of problem needed for quant by giving a better framework for how to approach them. If you're at Berkeley, that means taking Stat 150 after Stat 134/Data 140 (or taking EECS 126 and one-shotting probability and stochastic processes in the same course).

It should be abundantly clear by now that probability is the single-most important statistical skill needed for quant, so any statistics class that uses a lot of probability is probably (ha!) a good use of your time. In addition to stochastic processes, I think a game theory course (Stat 155 for all the Berkeley people) would be a good use of time for similar reasons.

## So You Want to be a Data Scientist (or Engineer, or Analyst...)

I know it's popular to hate on data science these days, and I'm proud to be one of those haters. Data science as it's taught in college courses reflects a set of tools and practices that were largely a zero-interest rate phenomenon of the 2010s, and most companies have realized that throwing hundreds of thousands of dollars at people who just run XGBoost slop in Jupyter Notebooks is not an efficient use of funds. Like seriously, did you really think you would get to use pandas every day on the job? Please!

That being said, there's still plenty of respectable data science jobs out there, spanning junior analyst roles, data engineering, and experimentation and causal inference.

I already talked about the importance of SQL for industry data science, but it's worth reiterating. Even if your school doesn't offer a SQL course, log onto Leetcode or StrataScratch and do their database questions. There is almost no way you're going to land a data science job if you can't run some basic queries.

In addition, I think it's underrated how much of industry data science is actually just *engineering*. Sure, there are roles explicitly titled "data engineer," but in practice there's no *inherent* difference in job duties between data scientists and data engineers. Sure, data scientists might be more on the modeling and experimentation side while data engineers are more focused on writing software for data pipelines and building dashboards, but there's more overlap between those positions than your annoying boss or recruiter might let on.

So I think generally having some basic computational competency goes a long way as a data scientist or data engineer. I've already discussed DSA and databases, but if you can find any courses on computer architecture, distributed systems, or networking, I'd recommend taking at least one of them.

If you're looking to be more on the analysis, modeling, and experimentation side, my first piece of advice is to significantly temper your expecations[^5]. This kind of work will be anywhere from 10 to 20 percent of your data science job, *if you are lucky*. But it's still important to know the data science modeling fundamentals – regression, classification, evaluation metrics – as well as how to handle data that may not be the clean, tabular batch data you're given in a CSV file on a class homework assignment (any type of sequential or unstructured data like time series data, text and language data, image data, etc.).

I'd say in addition to linear models, a class on "industry data science fundamentals," even if slightly outdated or unrepresentative of the day-to-day industry work, at least builds modeling fundamentals and gives a lot of hands-on practice working with different APIs and libraries. And plus, it's fun! I loved Data 100 at Berkeley, and I owe a lot to what I ultimately learned from my degree to the fundamentals I picked up in that course.

I'd also recommend taking a class on time series models, since forecasting and time-dependent data come up quite frequently in industry settings (bonus points if you can find a class that covers probabilistic forecasting and calibration). And any sort of class that covers causal inference, regression analysis, or experimentation (e.g. econometrics, applied regression analysis, causal/statistical/Bayesian inference, surveys and experiments) is also helpful if you want to go down the experimentation route in industry or have a job that requires any sort of model interpretability.

As a bonus, I'd like to endorse a "decision theory" class like Berkeley's Data 102. It's hard to categorize it cleanly into a certain type of statistics course since the course surveys topics like frequentist vs. Bayesian inference, GLMs, causal inference, and reinforcement learning, but I found it to be very technically rich and introduced me to things like Bayesian hierarchical models and bandit problems that I don't think I would have seen in any other class, at least in my undergrad.

## So You Want to be a Machine Learning Engineer

If you want to go the ML/AI engineer route, my first piece of advice is that statistics is not really that helpful as a major for those types of roles, and you will be much, MUCH better off pursuing a degree in computer science. This isn't necessarily an either-or situation, since many of the MLEs I know from Berkeley did, in fact, double major in CS and Stats, but MLE is fundamentally an *engineering* position. It's literally just software engineering for machine learning use cases.

All that said, that doesn't mean you *can't* become an MLE if you're a stats major, but you're going to have your work cut out for you. The first thing you're going to need more than any particular class in school is to be a proficient – dare I say pretty good – programmer. If you don't feel comfortable writing software or can't do Leetcode mediums and hards (no shame, I myself struggle with those), then a job that's predominantly focused on writing software is probably not for you to begin with.

But machine learning is still obviously really cool, and a lot of the theory actually has significant overlap with statistics (hence the field of "statistical learning"). If you take any sort of advanced machine learning class, you'll quickly find the same probability and statistics basics reappear everywhere in ML prediction problems.

I didn't talk about ML classes in the data scientist section of this blogpost, but all this advice applies there too. Getting good at ML is definitely an uphill battle, and unless you're some really cracked kid from South Bay, it's unlikely you're going to able to dive right into an advanced ML class your freshman or even your sophomore year. As I mentioned in the non-negotiables section, your undergraduate math coursework and probability class are far more important from a foundations perspective than trying to rush into an ML class as fast as possible.

For ML, you're going to need to be *really* comfortable with vector calculus – taking gradients in particular – as well as have a pretty great feel for linear algebra. I took linear algebra my freshman fall (and my calc 3 education left something to be desired, to say the least), so I took a convex optimization course (EECS 127 at Berkeley) the semester before I took Berkeley's advanced ML course CS 189, which helped me brush up on my linear algebra as well as get me comfortable with vector and matrix calculus. (Plus, optimization is itself a pretty essential part of ML algorithms.) Berkeley's stats major has its own variant of CS 189 called Stat 154, and the two courses are about 90-95% identical.

The main gripe people have with Berkeley's 189 course, particularly the spring semester version of the class that I took, is that it focuses a lot more on "classical ML" and statistical learning while omitting modern concepts like transformers entirely from the curriculum. If you want to learn about modern machine learning and deep learning, you're going to need to seek out a separate class. (Although, I've heard the fall version of the course covers transformers.) Berkeley's CS 182 is the canonical deep learning class (I took a data science department adminstered version of the class fall of my senior year since DS majors aren't allowed to sign up for the regular offering of the class), and there are also classes specifically on NLP like INFO 159 and the newly-offered EECS 183.

I'd take all these classes if you're interested in going the ML research or CS PhD route, but for MLE specifically, more than any one class in particular, you're going to need to know how to implement the models in practice. Your personal projects will go a long way early on, and try to get experience at either research labs or startups where they'll give you more free reign to implement deep learning models and get comfortable with PyTorch.

## So You Want to go to be a Grad Student

As you might notice during your undergrad, a lot of industry postings for data science jobs require some sort of graduate degree, either a Master's or a PhD. I think this is a bit silly and behind-the-times; data science by now is pretty widely offered as an undergraduate major, and it's not like the data science internship positions listed on LinkedIn or some other job board require some heavily specialized knowledge locked away behind a graduate degree. Most competent sophomores could probably do a lot of these data science internships after a semester of doing SQL and pandas.

However, even though we know this, HR doesn't, so grad school can be a worthwhile pursuit even if just for signaling purposes, especially if you want to be an industry data scientist.[^6]

If you did your undergrad in statistics and felt like you got a lot out of the coursework beyond what was required of you, I don't think there's much value in a statistics master's beyond that (unless the program offers a wide range of advanced coursework, like Stanford, Berkeley, or Chicago). I think CS masters programs are generally scams for people who majored in CS in their undergrad, but for people from non-CS backgrounds like statistics, I think it can be a real asset to your resume to have some actual computational training for what are fundamentally computationally-facing jobs in industry.

I'm personally not a fan of more "pre-professional" data science master's programs. I don't think they're *useless* per se, but I think your time would be a lot better spent getting a much less costly degree deepening your core knowledge and understanding of data science/statistics than taking a year or two to learn how to use some random cloud computing tool that's going to be outdated in three to five years anyway. Again, I think these programs have their place, especially for people who want to have some flexibility to upskill while working, but I'm personally not a fan.[^7]

PhD is an entirely different beast. If you want to do a statistics PhD, then honestly, I don't even think it's worth majoring in statistics in your undergrad. You're going to need an insane amount of mathematical maturity for a stats PhD, and that includes taking real and complex analysis, abstract algebra, optimization, topology, and whatever the hell other math classes there are (really wish I could be of more help here, but my math education never went beyond lower-division linear algebra). I'm not saying some statistics background in your undergrad is *entirely* useless – my guess would be it'd help to have some exposure to probability and mathematical statistics before starting a stats PhD – but I think you can still take those individual courses as supplements to a math major for the best possible prep. If you want to know what kind of math you're going to be dealing with in a Stats PhD, take a look at Berkeley's Stat 210A course. That shit is no joke.

Now, there are a bunch of other fields you can do a PhD in that are focused on *applying* stats to a specific domain, where it would be helpful to have some sort of undergraduate training in statistics. Biostats, economics, psychology, and political science all come to mind as fields where you're going to be heavily focused on statistical methodology and research, and – no joke – will likely become a much better statistical practitioner than someone getting their PhD in statistics.

If you want to go the applied stats route in an adjacent field, then I'd say strike a balance between statistical modeling classes, upper division math classes (cough, real analysis, cough), and some domain-specific classes in your undergrad. When I wanted to do an economics PhD, my plan was to take all the same statistics upper division courses I ended up doing (linear models, time series, causal inference) plus real analysis and some econ electives. Of course, I ended up not doing an econ PhD and did not even end up taking real analysis (perhaps something I'll do in my master's program), but if you want a PhD in any statistics adjacent field, those upper division math courses I mentioned are essentially requirements.

## Closing Thoughts

Statistics is a pretty underrated major in my opinion! It's more versatile than people give it credit for, and I see a lot of utility in having a statistics background even for jobs that aren't specifically "data science" (like financial analyst, product manager, or any job that requires you to run an A/B test). I think regardless of what your goals are, statistics has pretty good pathways to hone your skills in your specific subfields of interest, and it's just about optimizing your specific path to achieve those goals.

The biggest weakness of statistics as a major is that I don't think it adequately preps people to actually *do* things, i.e. put things into practice. No amount of solving for the maximum likelihood estimate on a homework PSET will make you know how to properly use window functions in SQL. So if you want to be a statistics major and also have industry aspirations, I'd do the best I could to supplement my statistics coursework with CS courses (or, at the very least, get good at Leetcode). I don't regret all that much from my undergrad and am generally happy with the way things turned out, but the one thing I really wish I had taken more seriously was my freshman year CS courses, and I continue to pay the price for my shaky DSA fundamentals to this day.

There's also the question of focusing on courses that prioritize theory vs. practice. Stats courses themselves tend to lean toward the former, and I generally think having a deeper understanding of theory makes you a better thinker and statistical problem-solver in the long-run. That being said, I think it's bad to avoid practical or applied classes entirely – take that SQL class! – so it's just about striking the correct balance for your specific goals. If you want to do a PhD or be a researcher of any kind, then you can prioritize theory a bit more, and whatever you'll need to put into practice you'll probably pick up from experience at a research lab. If you want to go into industry, then try to build projects on your own time and spend some time doing Leetcode.

I'll be the first to tell you I'm not as cracked as some of the quant people or stats PhDs I met in my undergrad, but I'm very thankful for my statistics education for at the very least making me a curious person. I personally find statistics to be a very useful framework for me to understand the world – it's useful when I can think about certain big decisions in my life in terms of "high variance" and "tail risk" – and I think quantitatively-oriented people stand a lot to gain from adding some statistics training to their educational background, even if they aren't full-fledged statistics majors.

---
#### Footnotes
[^1]: <small>Our Algebra 1 textbook was called <a href="https://homework.cpm.org/category/CC/textbook/cca/chapter/6"> College Preparatory Math (CPM) Core Connections </a> (peep Chapter 6 for the statistics unit). I also distinctly remember wondering how my TI-84 calculator knew what the slope and intercept of the regression line were. It took me until my freshman year of college to find out!</small>
[^2]: <small>I still consider myself a capitalist but I've developed economic views that are much more favorable to redistribution since then.</small>
[^3]: <small>This isn't exactly true even though it's what I tell people. I still like economics, but I just liked statistics more, and I decided I'd rather take classes dedicated to statistical modeling than on some specific sub-domain of economics like health econ or public finance.</small>
[^4]: <small>I took Berkeley's graduate linear models class, Stat 230A, my junior year. That class gave me a hard time but also developed my mathematical maturity more than almost any other class I took at Berkeley.</small>
[^5]: <small>Dare I say, *Curb Your Enthusiasm*.</small>
[^6]: <small>I'd say MLE jobs are a bit more flexible on undergrad vs. grad degree; ML research jobs usually require either a PhD or significant ML research experience in your undergrad; quant I don't think cares whether you have a graduate degree or not; and while it's possible to become a data scientist without a graduate degree, you'd usually have to start off as a junior analyst for a year or two (when you could instead spend those two years in grad school).</small>
[^7]: <small>The elephant in the room here is that my master's is also in data science, but it's a research-based master's program rather than a pre-professional or explicitly industry-facing program. I'm mostly taking statistics and CS theory coursework.</small>