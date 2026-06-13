---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
title: "Home"
nav_order: 1
hide_footer: true
---

<section class="home-intro">
  <img class="home-profile-photo" src="{{ '/assets/profile.JPG' | relative_url }}" alt="My photo">
  <div class="home-contact-card">
    <h2>{{ site.title }}</h2>
    <a class="home-email" href="mailto:{{ site.email }}">{{ site.email }}</a>
    <div class="home-social-links" aria-label="Social links">
      <a href="https://github.com/{{ site.github_username }}">GitHub</a>
      <span aria-hidden="true">&bull;</span>
      <a href="https://www.linkedin.com/in/{{ site.linkedin_username }}">LinkedIn</a>
      <span aria-hidden="true">&bull;</span>
      <a href="https://www.twitter.com/{{ site.twitter_username }}">Twitter</a>
    </div>
  </div>
</section>

Hi, my name is Arnav! I'm an applied scientist at Uber working on causal inference and machine learning R&D. I graduated from UC Berkeley where I majored in Statistics and Data Science, and I [somewhat regrettably](https://arnavg.github.io/jekyll/update/2026/06/01/june-2026.html#the-masters-post-mortem) also have a Master's in Data Science from UChicago.

I mostly use this website as a place to publicly host my own personal notes on stats/ML, as well as write other random blogs or shower thoughts I have. If you find any of my articles insightful or helpful, let me know!
