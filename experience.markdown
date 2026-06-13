---
layout: page
title: Experience
nav_order: 2
---

<section class="courses-page" aria-label="Experience, education, and coursework">
  <section class="profile-section" aria-labelledby="work-heading">
    <h2 id="work-heading" class="profile-section-title">Work</h2>
    <div class="profile-list">
      {% for item in site.data.courses_profile.work %}
        <article class="profile-entry">
          <img class="profile-icon" src="{{ item.icon | relative_url }}" alt="{{ item.company }} logo">
          <div class="profile-entry-body">
            <h3>{{ item.title }} <span>&middot;</span> {{ item.company }}</h3>
            <p>{{ item.dates }}</p>
          </div>
        </article>
      {% endfor %}
    </div>
  </section>

  <section class="profile-section" aria-labelledby="internships-heading">
    <h2 id="internships-heading" class="profile-section-title">Internships</h2>
    <div class="profile-list">
      {% for item in site.data.courses_profile.internships %}
        <article class="profile-entry">
          <img class="profile-icon" src="{{ item.icon | relative_url }}" alt="{{ item.company }} logo">
          <div class="profile-entry-body">
            <h3>{{ item.title }} <span>&middot;</span> {{ item.company }}</h3>
            <p>{{ item.dates }}</p>
          </div>
        </article>
      {% endfor %}
    </div>
  </section>

  <section class="profile-section" aria-labelledby="consulting-heading">
    <h2 id="consulting-heading" class="profile-section-title">Consulting Projects</h2>
    <div class="profile-list">
      {% for item in site.data.courses_profile.consulting_projects %}
        <article class="profile-entry">
          <img class="profile-icon" src="{{ item.icon | relative_url }}" alt="{{ item.company }} logo">
          <div class="profile-entry-body">
            <h3>{{ item.title }} <span>&middot;</span> {{ item.company }}</h3>
            <p>{{ item.dates }}</p>
          </div>
        </article>
      {% endfor %}
    </div>
  </section>

  <section class="profile-section" aria-labelledby="education-heading">
    <h2 id="education-heading" class="profile-section-title">Education</h2>
    <div class="profile-list education-list">
      {% for item in site.data.courses_profile.education %}
        <article class="profile-entry">
          <img class="profile-icon" src="{{ item.icon | relative_url }}" alt="{{ item.school }} logo">
          <div class="profile-entry-body">
            <h3>{{ item.school }}</h3>
            <p>{{ item.degree }} <span>&middot;</span> {{ item.dates }}</p>
            <p>{{ item.honor }}</p>
          </div>
        </article>
      {% endfor %}
    </div>
  </section>

  <section class="profile-section coursework-section" aria-labelledby="coursework-heading">
    <h2 id="coursework-heading" class="profile-section-title">Coursework</h2>
    <div class="course-pill-grid">
      {% for course in site.data.courses_profile.coursework %}
        <button class="course-pill" type="button" data-course-dialog="course-dialog-{{ forloop.index }}">
          <span class="course-code {{ course.school_key }}">{{ course.code }}</span>
          <span class="course-name">{{ course.short_name }}</span>
        </button>

        <dialog class="course-dialog" id="course-dialog-{{ forloop.index }}">
          <div class="course-dialog-panel">
            <button class="course-dialog-close" type="button" aria-label="Close course details">&times;</button>
            <div class="course-dialog-header">
              <img class="course-dialog-logo" src="{{ course.icon | relative_url }}" alt="{{ course.institution }} logo">
              <div>
                <p class="course-dialog-kicker">{{ course.institution }}</p>
                <h3><span class="{{ course.school_key }}">{{ course.code }}</span> {{ course.full_name }}</h3>
                <p>{{ course.term }}</p>
              </div>
            </div>
            <div class="course-dialog-body">
              <h4>Topics covered</h4>
              <p>{{ course.topics }}</p>
              {% if course.notes_url %}
                <a class="course-notes-link" href="{{ course.notes_url }}" target="_blank" rel="noopener">Notes</a>
              {% endif %}
            </div>
          </div>
        </dialog>
      {% endfor %}
    </div>
  </section>
</section>

<script src="{{ '/assets/courses.js' | relative_url }}"></script>
