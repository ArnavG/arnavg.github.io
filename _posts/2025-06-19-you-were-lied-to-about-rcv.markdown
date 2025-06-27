---
layout: post
title:  "Congrats, Zohran! Ranked-Choice Voting Still Sucks"
subtitle: "FairVote lied to you"
date:   2025-06-25 11:43:26 -0700
categories: jekyll update
---

It should come as no surprise that I'm writing this blogpost in the wake of the New York City Democratic mayoral primary. I'm not here to comment on the politics of the matter[^1], mostly because I don't live in New York City, and as such, I'm not particularly attached to the outcome of this election.

What I *do* want to talk about is that this election, like most ranked-choice voting (RCV) elections in recent memory, should serve as a textbook example of why RCV is a terrible way to elect candidates and worsens issues like polarization.

## But First...

Many of you may already know that NYC's Democratic mayoral primary follows a **ranked choice voting** scheme. Voters can rank their preferred candidates in order from 1 to 5, and the candidate with the fewest number of votes gets eliminated. Voters who ranked the eliminated candidate as their first choice get their vote transferred to their *second* choice candidate, and the process continues until one candidate nabs 50% of the vote, securing a majority. (NYC's voting scheme can actually more accurately be described as **instant runoff voting** \[IRV\] since each round that doesn't have a candidate win 50% of the vote triggers a "runoff" election among the non-losers without having the voters actually come back on a different day to vote.)

In principle, this is supposed to be an improvement over **first-past-the-post** (FPTP) voting, which is the voting structure most people are probably familiar with. In FPTP voting, the candidate with the greatest number of votes wins; simple enough to understand, and may even track our intuition, until you realize that in a field with more than two candidates, it's possible for the winner to receive less than 50% of the vote; or, put another way, that the majority of voters would have preferred someone other than the actual winner.

We don't need to look very far for some very egregious examples of FPTP's pitfalls. Both the <a href="https://en.wikipedia.org/wiki/2000_United_States_presidential_election">2000</a> and <a href="https://en.wikipedia.org/wiki/2016_United_States_presidential_election">2016</a> US presidential elections saw neither the Democratic nor Republican nominees reach 50% of the popular vote (in fact, in both these elections, the popular vote winner ended up losing the election due to the Electoral College, but that's a separate issue). FPTP is also how we ended up with someone as polarizing as Trump in the first place, as <a href="https://en.wikipedia.org/wiki/2016_Republican_Party_presidential_primaries">55.1% of Republican primary voters did not vote for him in 2016</a> but he was still able to secure a plurality. As another funny (and pathetic) example, in the <a href="https://en.wikipedia.org/wiki/2024_United_Kingdom_general_election">UK's 2024 general election</a>, the Labour Party secured a whopping 174-seat majority despite garnering only 33.7% of the popular vote.

The problems with FPTP voting are <a href="https://en.wikipedia.org/wiki/First-past-the-post_voting#Properties_and_effects">well-documented</a> and probably familiar to many voters, as well. One issue is that FPTP struggles to pick the Condorcet winner[^2], which basically means that if a candidate were to face every other candidate in a series of two-candidate elections, the Condorcet winner would win each of those matchups. For example, in the 2000 US presidential election in Florida, George Bush narrowly eked out a popular vote victory over Al Gore by just 537 votes. But imagine if Al Gore faced George Bush in a pure head-to-head election instead of having votes siphoned away from him by the Green Party candidate Ralph Nader, or potentially candidates from other smaller parties. In this hypothetical, Al Gore may actually be the Condorcet winner, but FPTP prevented him from winning the presidency.

This illustrates another problem with FPTP, which is related to something called <a href="https://en.wikipedia.org/wiki/Duverger%27s_law">Duverger's law</a>. In a voting system where the winner only needs to attain a plurality of the vote to win the election, voters have no incentive to vote for smaller "third parties" because these votes are very unlikely to influence the outcome, effectively becoming wasted votes that take away from the two leading parties. Thus, FPTP systems tend to consolidate around two dominant parties, squeezing out the viability of smaller parties. As we saw with Al Gore and Ralph Nader, third parties effectively become "spoilers" that funnel votes away from the only viable candidates.

## The Trouble with RCV

So FPTP voting systems clearly suck. A majority of voters can end up unhappy with the winner in a plurality voting system, and there's little room for third candidates to become viable and only serve to spoil the top two candidates.

At first glance, RCV may seem like a compelling alternative. Want to avoid a situation where half the voters did not vote for the winner? Simply allow them to rank all the candidates they'd be fine with winning! Don't like the fact that FPTP makes voting third party unviable? Allow voters to rank third parties in addition to party duopoly frontrunners! Let's pat ourselves on the back for thinking of that one.

But in fact, RCV solves basically none of the problems with FPTP voting that I talked about above. It can still struggle to pick the Condorcet winner, and believe it or not, still has similar disincentives from voting third party, worsens polarization through center squeeze, and is still not immune to spoiler effects and strategic voting.

I thought Joel Wertheimer had a pretty good illustration of how RCV systems fail to pick the Condorcet winner and lead to center squeeze on <a href="https://www.natesilver.net/p/can-anyone-beat-cuomo-and-is-it-zohran#:~:text=out%20in%20practice.-,Imagine,-that%20in%20a">Nate Silver's blog</a>. Imagine we have a polarizing election where the Republican nominee is Marjorie Taylor Greene while the Democratic nominee is Ilhan Omar, two candidates who represent the furthest right and left factions of their respective parties. There's also Joe Manchin, who's running as an independent. Republicans don't exactly love him, but he's certainly better than electing someone as left-wing as Omar; similarly, Democrats aren't exactly enamored with Manchin, who runs to the right of even some Blue Dog Democrats, but they're willing to vote for him over someone has extreme as Greene.

Let's say that 40% of voters support Greene as their first choice while 40% of voters support Omar as their first choice. That leaves the remaining 20% who would prefer neither Greene nor Omar - Manchin voters in this hypothetical. Additionally, let's assume that all Greene voters prefer Manchin to Omar and all Omar voters prefer Manchin to Greene.

What we're left with is Manchin emerging as the clear-cut Condorcet winner. If the election was a head-to-head between either Greene or Omar, Manchin would win with an overwhelming 60% majority. Sure, there might not be many people who *love* Manchin, but 80% of partisan voters would rather have him than a perceived extremist from the other party.

But let's see what happens under an instant runoff RCV system, much like the one in effect in NYC:

<table>
  <thead>
    <tr>
      <th><strong>Candidate Name</strong></th>
      <th><strong>First Round Vote Share</strong></th>
      <th><strong>Second Round Vote Share</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color:#f8d7da;">
      <td>Marjorie Taylor Greene (R)</td>
      <td>40%</td>
      <td>45%</td>
    </tr>
    <tr style="background-color:#d1ecf1;">
      <td>Ilhan Omar (D)</td>
      <td>40%</td>
      <td style="background-color:#007bff; color:white;"><strong>55%</strong></td>
    </tr>
    <tr style="background-color:#e2e3e5;">
      <td>Joe Manchin (I)</td>
      <td>20%</td>
      <td>(Eliminated)</td>
    </tr>
  </tbody>
</table>

Since only 20% of voters ranked Manchin as their first choice, he would be eliminated heading into the second round of the instant runoff, where (in this hypothetical) Omar receives 15% of second-choice votes from first-choice Manchin voters while Greene receives 5%. But as we saw earlier, Manchin is the overwhelming Condorcet winner! Had the race been a head-to-head matchup against either of the more polarizing candidates, he would have won with a 60% majority. Yet, the instant runoff voting system, Manchin is penalized for running as a third party, leading to the exact same center squeeze effect that is seen under FPTP.[^3]

This isn't just a toy example, though; we've seen high-profile races with instant runoff voting lead to these "Condorcet failures" time and time again.

Take the 2022 US House elections in Alaska, for example.

These were the first two House elections in Alaska that used instant runoff voting as opposed to FPTP, first in the 2022 special election following the death of 49-year incumbent Don Young, and then in the November 2022 midterms. In both races, Democrat Mary Peltola would defeat Republicans Sarah Palin and Nick Begich III and be sent to the House of Representatives, despite the fact that Begich was the Condorcet winner of both elections.

In the special election, Peltola led both Palin and Begich in Round 1 (after all the write-in candidates had been eliminated) with around 40% of the vote, while Begich received the lowest share of the vote and was eliminated heading into the final round. Peltola would go on to best Palin by a narrow 3% margin.

<b> Voting in the 2022 Alaska House of Representatives Special Election </b>

<table>
  <thead>
    <tr>
      <th><strong>Candidate Name</strong></th>
      <th><strong>First Round Vote Share</strong></th>
      <th><strong>Second Round Vote Share</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color:#f8d7da;">
      <td>Sarah Palin (R)</td>
      <td>31.27%</td>
      <td>48.52%</td>
    </tr>
    <tr style="background-color:#d1ecf1;">
      <td>Mary Peltola (D)</td>
      <td>40.19%</td>
      <td style="background-color:#007bff; color:white;"><strong>51.48%</strong></td>
    </tr>
    <tr style="background-color:#f8d7da;">
      <td>Nick Begich III (R)</td>
      <td>28.53%</td>
      <td style="background-color:#e2e3e5;">(Eliminated)</td>
    </tr>
  </tbody>
</table>

And in November later that year, more or less the exact same scenario played out: Peltola defeated both Palin and Begich once again, with Begich being eliminated before the final round of voting despite being that election's Condorcet winner.

<b> Voting in the 2022 Alaska House of Representatives November Midterm Election </b>

<table>
  <thead>
    <tr>
      <th><strong>Candidate Name</strong></th>
      <th><strong>First Round Vote Share</strong></th>
      <th><strong>Second Round Vote Share</strong></th>
      <th><strong>Third Round Vote Share</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color:#f8d7da;">
      <td>Sarah Palin (R)</td>
      <td>25.82%</td>
      <td>26.32%</td>
      <td>45.04%</td>
    </tr>
    <tr style="background-color:#d1ecf1;">
      <td>Mary Peltola (D)</td>
      <td>48.66%</td>
      <td>49.22%</td>
      <td style="background-color:#007bff; color:white;"><strong>54.96%</strong></td>
    </tr>
    <tr style="background-color:#f8d7da;">
      <td>Nick Begich III (R)</td>
      <td>23.62%</td>
      <td>24.46%</td>
      <td style="background-color:#e2e3e5;">(Eliminated)</td>
    </tr>
    <tr style="background-color:#ffffe0;">
      <td>Chris Bye (L)</td>
      <td>1.89%</td>
      <td style="background-color:#e2e3e5;">(Eliminated)</td>
      <td style="background-color:#e2e3e5;">(Eliminated)</td>
    </tr>
  </tbody>
</table>

Ironically, the exact complaints levied at FPTP's voting incentive structure apply directly to the Alaska race. The race did not increase the salience of third party candidates; the Libertarian candidate Chris Bye received far too few votes to make it past Round 1, and like many other IRV elections, the vote ultimately consolidates around the two frontrunners (which in many cases also represents the party duopoly). Additionally, the exact same spoiler effect that is lambasted in FPTP systems was on full display in Alaska, with Sarah Palin (incidentally the Condorcet *loser*) siphoning early round votes that could have gone to Begich, setting up an eventual Republican victory.

Ultimately, Begich got the last laugh, as without a Republican spoiler like Palin in the 2024 House race, he was able to defeat Peltola 51-49. (The vote to repeal RCV narrowly failed 49.9-50.1.)

## Some Parallels in New York

At the time I'm writing this, it's too early to claim that someone other than Zohran Mamdani or Andrew Cuomo would have been the Condorcet winner (for all I know, it could be Zohran and we don't have a Condorcet failure in this election).

But what we can observe from first-round returns, as well as general trends throughout the primary race, is that New York's RCV system did nothing to increase the viability of "alternative" candidates, and had a massive center squeeze effect due to just how polarizing the top two candidates were.

Let's take a look at the tentative <a href="https://www.nytimes.com/interactive/2025/06/24/us/elections/results-new-york-primary.html">round 1 results from the New York Times</a>:

![Round 1 results for the Democratic Mayoral Primary. With 93% reporting, Zohran leads with 43.5% of the vote, Cuomo is in second with 36.4%, Lander is in third with 11.3%, Adams is in fourth with 4.1%, and the remaining candidates garnered no more than 1% of the vote.](/assets/article_images/2025-06-19-images/NYT_primary_results.png "Round 1 results for the Democratic Mayoral Primary")

I'm not here to claim that there wasn't a lot of popular, grassroots support for Zohran Mamdani. He ran a fantastic campaign, and 43.5% of the first-round vote outperforms even his <a href="https://emersoncollegepolling.com/new-york-city-mayoral-poll-june/">most optimistic polling numbers.</a>

On the contrary, the actual problem with RCV lies with Cuomo, not Mamdani.

Cuomo is <a href="http://nypost.com/2025/03/10/us-news/ex-gov-cuomo-claws-back-his-popularity-but-not-with-ny-dems-poll/">quite unpopular among New York Democrats</a> and resigned in disgrace from the governorship in 2021 after <a href="https://apnews.com/article/andrew-cuomo-resigns-17161f546bb83c32a337036ecf8d2a34">a slew of sexual harassment allegations</a> in addition to pressure from <a href="https://www.cnn.com/2021/08/03/politics/joe-biden-andrew-cuomo-reaction">the White House</a> and <a href="https://thehill.com/homenews/house/566187-pelosi-calls-for-cuomos-resignation/">other nationally high-profile Democrats.</a>

And yet, he was *still* able to garner 36.4% of the first-round vote.

I don't think this really suggests some sizable baseline support for Cuomo so much as it suggests that there's likely quite a big appetite for a more moderate "Anyone But Zohran" candidate. The fault of the Democratic establishment, of course, was consolidating around quite literally the worst possible "moderate" option so as to make what was a pretty wide slate of alternatives with little baggage completely unviable.

In other words, Cuomo was the spoiler of this election, and Brad Lander likely got center squeezed.

But this is a feature of RCV elections as we've seen, not a bug. For at least the last couple of months, we've known that this was essentially a two-man race between Mamdani and Cuomo, and the voting structure being ranked-choice did absolutely nothing to increase the viability of alternative candidates. It's also a case study in polarization – with only two candidates remotely viable to win the race, Democratic primary voters are forced to align with either the polarizing centrist or the polarizing progressive, while a middle-of-the-road option like Lander (who may win head-to-head matchups against Mamdani and Cuomo!) gets completely squeezed out. What we're left with is a graveyard of candidates who are likely more politically aligned with the median primary voter than the two frontrunners getting a pitiful 1% of the vote in the first round.

## Healthy Alternatives?

RCV solves basically none of the main issues people have with FPTP, and contrary to popular belief, it doesn't lead to election results that better reflect the preferences of the median voter.

Luckily, you don't need to design a particularly complicated voting system to get better election results.

One such method is called **approval voting**, where you can vote for *as many candidates as you want*. (Yes, you can even check all the boxes on your ballot and vote for all the candidates.)

There's many intuitive, qualitative reasons to like approval voting. One is that it eliminates vote splitting, so you don't have to worry about helping a spoiler candidate inadvertently. Imagine if all the Palin-first, Begich-second voters could have "approved" of both candidates without worrying about the order in which they did it or which of the two would make it to the final round. In that case, Palin's spoiler effect would have been nullified, potentially allowing for Begich to secure an election victory. Similarly, imagine if all the people who had Cuomo or Mamdani as their first choice could have also approved of Lander; instead of Lander getting eliminated before the final round, he'd have a fair shot of winning the whole election.

Another reason is that it encourages a more "honest" expression of voter preferences, and as long as everyone votes honestly, new candidates (like third parties) can only change the outcome of the election if they get enough approval to win, eliminating the spoiler effect. Sure, there is still some strategic meta-gaming involved, like the fact that approving Candidate B (whom you prefer less than Candidate A) might slightly reduce A's margin of victory, but ultimately, approving both A and B allows voters to coordinate around the stronger of the two, without having to gamble on who others think is viable. In this way, approval voting creates space for consensus-building, rather than punishing nuance.

Another underrated advantage of Approval Voting is that it's very easy to implement. There's no need to print out new, specialized ballots to rank candidates in any specific order. All you need to do is let voters know they're allowed to check multiple boxes! This makes approval voting the most "bang for your buck" reform, in my opinion.

Now, that doesn't make approval voting a perfect system. Incidentally, RCV/IRV at the very least guarantee that the <a href="https://en.wikipedia.org/wiki/Condorcet_loser_criterion">Condorcet loser</a> does not win the election, essentially ensuring that the truly worst and weakest candidates do not see public office. Theoretically, approval voting <a href="https://en.wikipedia.org/wiki/Condorcet_winner_criterion#Approval_voting">neither guarantees that the Condorcet winner will win</a>, <a href="https://en.wikipedia.org/wiki/Condorcet_loser_criterion#Compliance">nor does it guarantee that the Condorcet winner will lose.</a>

Approval voting is also not immune to annoying strategy games as well (not everyone will vote honestly!). Voters must decide where to set their “approval threshold” (how many candidates to vote for), and in certain pathological cases, poorly chosen thresholds can result in electing a Condorcet loser or failing to elect a Condorcet winner.

Take the following example, where there is a pretty big consensus around candidates Blue and Red, with smaller but significant support for Green. We'll also assume that among voters who approve of both Blue and Red, half of them (to the left of the black line) slightly prefer Blue while the other half (to the right of the black line) slightly prefer Red.

![Approval voting example among Blue, Red, and Green.](/assets/article_images/2025-06-19-images/approval_voting_flaw_1.png "Approval Voting Example")

Under approval voting, 9 voters would approve of Blue, 8 would approve of Red, while 7 would approve of Green. This seems close, but another way to look at it is that 61% voters do *not* want Green to win, and about the same number of voters are okay with either Red or Blue winning (33%) as the number of voters who want Green to win (39%). Even though Blue narrowly beats Red, there's enough joint approval between their voters that, if they voted their preferences honestly, most people should approve of the results of the election.

However, three of those purple voters ever so slightly prefer Red. (In fact, we can take the hypothetical to a different extreme, where all three of those voters are tepid at best on Blue but *hate* Green, and are willing to approve of Blue to ensure Green doesn't win.) These three voters might realize that they can vote strategically; they can choose to defect from approving Blue, to give their slightly-preferred candidate the edge to steal the election from behind. Now, Red wins with 8 votes to Blue's 6 and Green's 7.

![Approval voting example among Blue, Red, and Green, but some Red voters defect](/assets/article_images/2025-06-19-images/approval_voting_flaw_2.png "Strategic Approval Voting (Red Voters Defect)")

But those three purple voters who ever so slightly prefer Blue realize they can also defect by only approving their slightly-preferred candidate. Remember, people cannot see who other people vote for beforehand, so a better mental model for this strategy game is that the strategic voters defect simultaneously rather than respond to each other's moves. Let's see what happens if *all* purple voters strategically approve of their slightly preferred candidate:

![Approval voting example among Blue, Red, and Green, but all purple voters defect](/assets/article_images/2025-06-19-images/approval_voting_flaw_3.png "Strategic Approval Voting (Some Red and Blue Voters Defect)")

All of a sudden, Green emerges as the new winner with 7 approval votes compared to Blue's 6 and Red's 5, and approval voting has failed to elect a candidate based on popular consensus.

If you've soured on approval voting because of this, I would say that in practice, this concern is very minuscule. For one, this hypothetical may actually illustrate a strength of approval voting rather than a weakness, which is that voters have no incentive to vote dishonestly! Obviously, this does still mean that approval voting is still vulnerable to strategizing from certain coalitions of voters, but small-scale defections will likely not sway election results when the broader incentive is to vote honestly. Additionally, it can be argued that under some fairly reasonable assumptions, <a href="https://rangevoting.org/AppCW.html"> approval voting will produce a Condorcet winner</a> in practice. Jameson Quinn writes on his blog Election Science that cardinal voting methods like approval voting have a <a href="https://electionscience.github.io/vse-sim/VSEbasic">Voter Satisfaction Efficiency (VSE) rating of 89-95%</a>, compared to plurality methods like FPTP with a VSE of around 75% and RCV/IRV which has a VSE of just 79% under strategic voting.

But another reason why we would prefer cardinal methods like approval voting is that being a Condorcet method is not actually the only goal of an election system, and approval voting (and other cardinal voting methods) do a good job of selecting for overall candidate acceptability rather than a specific social choice criterion.

Condorcet methods only guarantee a Condorcet winner *if one exists*. And that's a big "if." There are many scenarios, especially in polarized electorates, where no Condorcet winner exists at all. This phenomenon is known as the Condorcet cycle, or <a href="https://en.wikipedia.org/wiki/Condorcet_paradox">Condorcet’s paradox</a>, where voter preferences become intransitive: a majority prefers A over B, B over C, and C over A, forming a cycle with no clear majority winner. For example, in a three-candidate election:

- 35% of voters rank A > B > C

- 33% rank B > C > A

- 32% rank C > A > B

Here, A beats B, B beats C, and C beats A in pairwise matchups, creating a cycle where no Condorcet winner exists. In these cases, Condorcet methods usually rely on some arbitrary tiebreaking criterion that vary by implementation (e.g., Schulze, Ranked Pairs, Minimax).

In fact, Condorcet's paradox is a special case of <a href="https://en.wikipedia.org/wiki/Arrow%27s_impossibility_theorem">Arrow’s Impossibility Theorem</a>, which proves that no ranked voting system can satisfy all fairness criteria (like transitivity, independence of irrelevant alternatives, and unanimity) at the same time. (For more info and a fun watch, check out this Veritasium video on <a href="https://www.youtube.com/watch?v=qf7ws2DF-zk">Why Democracy is Mathematically Impossible</a>.)

Luckily, Arrow's Impossibility Theorem only applies in *ordinal* voting systems where voters rank candidates over others. But in *cardinal* or *rated* voting systems, voters are able to express how *much* they prefer some candidates over others.

Approval voting is one such method, and we've talked about its advantages like preventing the spoiler effect and mitigating center squeeze/polarization. But as we saw from the hypothetical above, it may also be nice if voters could express *just how much* they approve of one candidate relative to another candidate.

Thankfully, there are other great cardinal voting methods, like **score voting**, that accomplish this. In score voting, voters can give each candidate a number on how much they "approve" of a certain candidate, and the candidate with the highest average score wins. Approval voting is equivalent to a simplified type of score voting where 0 and 1 are the only possible scores, but the reason to prefer voting on a range of scores rather than a binary is that it allows for partial approval ratings that can appropriately weigh your preference for two candidates.[^4] (For example, if you wanted to protest vote against Kamala Harris and vote third party, you could both score your third party preference very high, and also give some smaller number to Kamala so as to not totally throw your vote away to Trump.) Like approval voting, score voting incentivizes honestly rating your preferred candidates, and you are never penalized for giving your favorite candidate a higher ranking. (Specifically, score voting satisfies unanimity and independence of irrelevant alternatives, as shown in <a href="https://www.youtube.com/watch?v=e3GFG0sXIig">this helpful video by Undefined Behavior.</a>)

A special case of score voting is called **STAR voting** (score then automatic runoff). In STAR voting, voters score each candidate (typically from 0 to 5), just like in score voting. Then, the two candidates with the highest total scores become finalists in an automatic runoff, where the finalist preferred by more voters (i.e., who is scored higher on more ballots) wins.

This hybrid design helps address one of the main criticisms of score voting: that a candidate with extremely high support from a small group could win despite being widely disliked by the rest of the electorate. STAR solves this by adding the runoff phase, ensuring the winner is not just highly rated but also broadly acceptable to a majority.

Now, there are ways in which score voting may fail to select the Condorcet winner (or majority rule winner). To borrow an example from Undefined Behavior's YouTube video:

![Charmander vs. Squirtle in Score Voting](/assets/article_images/2025-06-19-images/score_voting_flaw_1.png "Charmander vs. Squirtle in Score Voting")

Let's say 60% of the electorate scores Charmander at 5 stars and Squirtle at 1 star, while 40% of the electorate scores Charmander at 1 star and Squirtle at 4 stars. Here, Charmander easily emerges as both the majority rule winner and the Condorcet winner, as 60% of voters prefer Charmander to Squirtle in a head-to-head matchup. Yet, using score voting, Charmander's average rating would be 3.4 stars while Squirtle's would be 4 stars, making Squirtle the winner.

Once again, I see this as a feature of score voting and not a bug. Like I said earlier, there are other criteria that a good election system should satisfy outside of just selecting the Condorcet winner, and this is one of them. Squirtle is the *depolarizing* candidate of the two options, widely acceptable across the entire electorate, while Charmander is incredibly polarizing. Imagine those 40% of voters are bug-type Caterpies, who would be marginalized under Charmander's oppressive fire-type attacks; score voting would instead allow those Caterpies to have their desire for a neutral candidate, a desire that is shared by the rest of the electorate, to be heard as voters.

## Some Polarization Simulations

I think this depolarizing effect is the biggest advantage of cardinal voting systems like approval voting and score voting. In New York City, for example, it's highly unlikely that a candidate like Brad Lander would be unacceptable to the electorate, and I'd bet good money that he'd be the most *acceptable* candidate to primary voters (even if not necessarily the Condorcet winner) given just how polarizing Zohran Mamdani and Andrew Cuomo are. Yet, because of RCV's center squeeze effect, Lander never really had a chance to put up a fair fight (deputy mayor anyone?).

Time and time again, RCV utterly fails at reflecting candidate acceptability, and with <a href="https://www.pewresearch.org/short-reads/2022/03/10/the-polarization-in-todays-congress-has-roots-that-go-back-decades/">increasingly polarizing elected officials</a>, I worry that the appetite for electoral reform has been misplaced in a system that basically makes no meaningful improvements over FPTP voting.

To more left-leaning readers, I know this makes it sound like I just don't want any progressive candidates to win and that I'm basing my opinion on electoral reform on my own bias towards more "moderate" or center-left candidates. But if you don't support cardinal voting because it may hurt your favorite left-leaning candidate, I'd argue you're the one operating from an ideology-first, principles-second perspective, where you start off with the assumption that your preferred candidate is the "correct" one to elect.[^5] On the other hand, I am perfectly fine if a left-leaning candidate gets elected with approval or score voting; in fact, it would imply that candidate has broad, popular support and is widely acceptable to most of the electorate. Fundamentally, I want voters to be *happy* with their elected officials, and the less polarizing those elected officials are, the more I have faith that voters will have some trust restored in their democratic institutions. In Alaska, my preferred candidate, Mary Peltola, undoubtedly benefited from RCV, but I would support moving to approval voting or score voting at the <a href="https://arxiv.org/html/2303.00108v2#S5">cost of electing Begich over her</a> because I believe that Begich was the candidate who better represented Alaska's constituents (as evidenced by the fact that he would go on to win the head-to-head rematch in 2024!) and it is healthier for democracy when most voters approve of the candidates they elect.

You don't have to just take me at my word when I say that approval voting and score voting are "depolarizing." In fact, we can simulate just how depolarizing they are compared to FPTP and RCV/IRV.

We'll start by making the assumption that "ideology" is something we can measure on a 1-dimensional axis (obviously, ideology is multi-dimensional, and you can extend this same example to higher dimensions, but I'm using low dimensions for the sake of visualization). We'll generate 1,000 voters and 10 candidates whose ideologies follow a normal distribution (you can change the distributional assumption, doesn't matter too much) centered around a mean of 0, our "median voter" ideology, and a dispersion around the median of 0.5, and simulate their voting patterns across 10,000 elections.[^6]

{% highlight python %}
# imports
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.spatial.distance import cdist
from sklearn.metrics import pairwise_distances_argmin_min

# Simulation parameters
n_elections = 10_000 # Number of elections
n_voters = 1_000  # Number of voters
n_candidates = 10  # Number of candidates
dim = 1 # 1-dimensional political beliefs dimension
dispersion = 0.5  # Dispersion of candidates across the dimension
np.random.seed(42)  # For reproducibility

def generate_distribution(n_points, dim, dispersion):
    """Generate candidate positions in the political dimension."""
    return np.random.normal(loc=0, scale=dispersion, size=(n_points, dim))

voters = generate_distribution(n_voters, dim, dispersion)
candidates = generate_distribution(n_candidates, dim, dispersion)
{% endhighlight %}

The ideologies of our 1,000 voters will be distributed as follows:
<details>
<summary><b>View Code</b></summary>
{% highlight python %}
plt.scatter(voters, np.zeros_like(voters), color='gray', alpha=0.5, label='Voters')
plt.title("1D Voter Distribution (Gray)")
plt.yticks([])
plt.xlabel("Ideological Position")
plt.grid(True, axis='x')
plt.legend()
plt.tight_layout()
plt.show()
{% endhighlight %}
</details>

![Ideological Distribution of Voters (1 Dimension)](/assets/article_images/2025-06-19-images/1d_voter_ideologies.png "Ideological Distribution of Voters (1 Dimension)")

And the ideologies of our 10 candidates will be distributed as follows:
<details>
<summary><b>View Code</b></summary>
{% highlight python %}
colors = plt.cm.get_cmap('tab10', n_candidates)
plt.scatter(voters, np.zeros_like(voters), color='gray', alpha=0.5, label='Voters')
for i in range(n_candidates):
    plt.scatter(candidates[i], 0, color=colors(i), edgecolor='black', s=100, label=f'Candidate {i}')
plt.title("1D Voters and Candidates")
plt.yticks([])
plt.xlabel("Ideological Position")
plt.grid(True, axis='x')
plt.tight_layout()
plt.show()
{% endhighlight %}
</details>

![Ideological Distribution of Candidates (1 Dimension)](/assets/article_images/2025-06-19-images/1d_candidate_ideologies.png "Ideological Distribution of Candidates (1 Dimension)")

For the purposes of our simulation, we will assume that voters most strongly prefer the candidate that they are "closest" to geometrically (making use of the `cdist` <a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.distance.cdist.html">function in scipy</a>), then prefer the candidate they are second closest to second, third closest to third, and so on. A plot of candidates and their first-choice voters would look like the following in 1-dimension:

<details>
<summary><b>View Code</b></summary>
{% highlight python %}
distances_1d = cdist(voters, candidates)
nearest_candidate_1d = np.argmin(distances_1d, axis=1)
for i in range(n_candidates):
    voter_subset = voters[nearest_candidate_1d == i]
    plt.scatter(voter_subset, np.zeros_like(voter_subset), color=colors(i), alpha=0.5, label=f'Voters for Candidate {i}')
plt.scatter(candidates[:, 0], np.zeros_like(candidates[:, 0]), color=[colors(i) for i in range(n_candidates)], edgecolor='black', s=100, marker='X', label='Candidates')
plt.title("1D Voters Colored by Nearest Candidate")
plt.yticks([])
plt.xlabel("Ideological Position")
plt.grid(True, axis='x')
plt.tight_layout()
plt.show()
{% endhighlight %}
</details>

![1D Voters Colored by Nearest Candidate](/assets/article_images/2025-06-19-images/1d_voter_closest_candidate.png "1D Voters Colored by Nearest Candidate")

Now, we can simulate the ideological distribution of election winners under 5 different systems: FPTP, RCV/IRV, approval voting, STAR voting, and Condorcet voting. [^7] Across a 1-dimensional measure of ideology, we get the following results:

<details>
<summary><b>View Code</b></summary>
{% highlight python %}
# Voting methods
def simulate_fptp(voters, candidates):
    """Simulate First-Past-The-Post voting."""
    distances = cdist(voters, candidates)
    votes = np.argmin(distances, axis=1)
    winner = np.bincount(votes).argmax()
    return candidates[winner]

def simulate_irv(voters, candidates):
    distances = cdist(voters, candidates)
    rankings = np.argsort(distances, axis=1)
    remaining = list(range(len(candidates)))

    while len(remaining) > 1:
        first_choices = rankings[:, 0]
        counts = np.bincount(first_choices, minlength=len(candidates))
        counts = [counts[i] if i in remaining else 0 for i in range(len(candidates))]
        min_index = np.argmin([counts[i] for i in remaining])
        to_eliminate = remaining[min_index]
        remaining.remove(to_eliminate)
        rankings = np.array([[c for c in r if c in remaining] for r in rankings])

    return candidates[remaining[0]]

def simulate_approval(voters, candidates, threshold=0.5):
    distances = cdist(voters, candidates)
    approvals = distances <= threshold
    approval_counts = approvals.sum(axis=0)
    winner = approval_counts.argmax()
    return candidates[winner]

def simulate_star(voters, candidates):
    distances = cdist(voters, candidates)
    scores = 1 - distances / distances.max()
    total_scores = scores.sum(axis=0)
    top_two = np.argsort(total_scores)[-2:]
    head_to_head_votes = (scores[:, top_two[1]] > scores[:, top_two[0]]).sum()
    winner = top_two[1] if head_to_head_votes > n_voters / 2 else top_two[0]
    return candidates[winner]

def simulate_condorcet(voters, candidates):
    n = len(candidates)
    wins = np.zeros(n)
    distances = cdist(voters, candidates)
    for i in range(n):
        for j in range(n):
            if i != j:
                votes_i = (distances[:, i] < distances[:, j]).sum()
                votes_j = n_voters - votes_i
                if votes_i > votes_j:
                    wins[i] += 1
    winner = np.argmax(wins)
    return candidates[winner]

methods = ['fptp', 'irv', 'approval', 'star', 'condorcet']
results = {}

def run_simulation(dim, n_elections, n_voters, n_candidates, dispersion):
    methods = ['fptp', 'irv', 'approval', 'star', 'condorcet']
    results = {}
    for method in methods:
        winners = []
        for _ in range(n_elections):
            voters = generate_distribution(n_voters, dim, dispersion)
            candidates = generate_distribution(n_candidates, dim, dispersion)
            if method == 'fptp':
                winner = simulate_fptp(voters, candidates)
            elif method == 'irv':
                winner = simulate_irv(voters, candidates)
            elif method == 'approval':
                winner = simulate_approval(voters, candidates)
            elif method == 'star':
                winner = simulate_star(voters, candidates)
            elif method == 'condorcet':
                winner = simulate_condorcet(voters, candidates)
            winners.append(winner)
        # For 1D, flatten to 1D array; for 2D, keep as is
        if dim == 1:
            results[method] = np.array([w[0] if isinstance(w, np.ndarray) else w for w in winners])
        else:
            results[method] = np.array(winners)
    return results, methods

# Run 1D simulation
results_1d, methods = run_simulation(
    dim=dim,
    n_elections=n_elections,
    n_voters=n_voters,
    n_candidates=n_candidates,
    dispersion=dispersion
)

from scipy.stats import gaussian_kde

# Plot using matplotlib and gaussian_kde for more control
plt.figure(figsize=(15, 6))

x_vals = np.linspace(-1.5, 1.5, 500)

for method in methods:
    kde = gaussian_kde(results_1d[method])
    y_vals = kde(x_vals)
    plt.plot(x_vals, y_vals, label=method.upper())

plt.title('Distribution of Winner Ideologies by Voting Method (1D)')
plt.xlabel('Ideological Position')
plt.ylabel('Density')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()
{% endhighlight %}
</details>

![Ideological Distribution of Winners (1 Dimension)](/assets/article_images/2025-06-19-images/1d_winner_ideologies.png "Ideological Distribution of Winners (1 Dimension)")

Here, the story is pretty clear. FPTP is abysmal at selecting winners that reflect the ideology of the median voter, with some winners in the tails of the distribution having ideologies more than 1 standard deviation apart from the median voter. RCV/IRV make small improvements on FPTP and generally select winners within 1 SD of the median voter's ideology, but even in our simulation, you can see the tendency of RCV/IRV to tend towards bimodality, suggesting polarization. In fact, the modal outcome under RCV/IRV is that the winners have ideologies around half a standard deviation away from the median voter.

On the other hand, all of approval, STAR, and Condorcet voting are able to select winners whose ideological distributions center tightly around the opinions of the median voter, thereby avoiding the same polarization effects seen under RCV/IRV. This falls in line with expected theory, that voting systems that optimize for "acceptability" to the broader electorate tend to select candidates that are most reflective of the attitudes of the median voter.

We can repeat the simulation with ideology represented in 2-dimensions as well.

{% highlight python %}
# Run 2D simulation
dim = 2
voters = generate_distribution(n_voters, dim, dispersion)
candidates = generate_distribution(n_candidates, dim, dispersion)
{% endhighlight %}

Once again, we can plot the ideologies of our simulated voters, this time on a political compass-style 2-dimensional axis:

<details>
<summary><b>View Code</b></summary>
{% highlight python %}
plt.scatter(voters[:, 0], voters[:, 1], color='gray', alpha=0.5, label='Voters')
plt.title("Voter Distribution in 2D (Gray)")
plt.xlabel("Ideological Position X")
plt.ylabel("Ideological Position Y")
plt.grid(True)
plt.legend()
plt.axis('equal')
plt.tight_layout()
plt.show()
{% endhighlight %}
</details>

![Ideological Distribution of Voters (2 Dimensions)](/assets/article_images/2025-06-19-images/2d_voter_ideologies.png "Ideological Distribution of Voters (2 Dimensions)")

Like before, we will simulate ideological data for our 10 candidates, this time as points in 2-dimensional space:

<details>
<summary><b>View Code</b></summary>
{% highlight python %}
colors = plt.cm.get_cmap('tab10', n_candidates)
plt.scatter(voters[:, 0], voters[:, 1], color='gray', alpha=0.5, label='Voters')
for i in range(n_candidates): 
    plt.scatter(candidates[i, 0], candidates[i, 1], color=colors(i), edgecolor='black', s=100, label=f'Candidate {i}')
plt.title("Voters and Candidates in 2D")
plt.xlabel("Ideological Position X")
plt.ylabel("Ideological Position Y")
plt.grid(True)
plt.axis('equal')
plt.tight_layout()
plt.show()
{% endhighlight %}
</details>

![Ideological Distribution of Candidates (2 Dimensions)](/assets/article_images/2025-06-19-images/2d_candidate_ideologies.png "Ideological Distribution of Candidates (2 Dimensions)")

And finally, we can once again map voters to their first-choice candidates based on their Euclidean distance from each candidate: the closest candidate is their first choice, second closest second choice, and so on.

<details>
<summary><b>View Code</b></summary>
{% highlight python %}
distances = cdist(voters, candidates)
nearest_candidate = np.argmin(distances, axis=1)
for i in range(n_candidates):
    voter_subset = voters[nearest_candidate == i]
    plt.scatter(voter_subset[:, 0], voter_subset[:, 1], color=colors(i), alpha=0.5, label=f'Voters for Candidate {i}')
plt.scatter(candidates[:, 0], candidates[:, 1], color=[colors(i) for i in range(n_candidates)],
            edgecolor='black', s=100, marker='X', label='Candidates')
plt.title("Voters Colored by Nearest Candidate in 2D")
plt.xlabel("Ideological Position X")
plt.ylabel("Ideological Position Y")
plt.grid(True)
plt.axis('equal')
plt.tight_layout()
plt.show()
{% endhighlight %}
</details>

![2D Voters Colored by Nearest Candidate](/assets/article_images/2025-06-19-images/2d_voter_closest_candidate.png "2D Voters Colored by Nearest Candidate")

Finally, we can recover the 2D ideological positions of winners across each of our simulated election formats:

<details>
<summary><b>View Code</b></summary>
{% highlight python %}
results_2d, _ = run_simulation(
    dim=dim,
    n_elections=n_elections,
    n_voters=n_voters,
    n_candidates=n_candidates,
    dispersion=dispersion
)

import matplotlib.gridspec as gridspec

fig = plt.figure(figsize=(18, 12))
gs = gridspec.GridSpec(2, 3)
axes = []

for i, method in enumerate(methods):
    ax = fig.add_subplot(gs[i // 3, i % 3])
    x = results_2d[method][:, 0]
    y = results_2d[method][:, 1]
    sns.kdeplot(x=x, y=y, fill=True, ax=ax, cmap="Blues", bw_adjust=0.4, levels=100, thresh=0.01)
    ax.set_title(method.upper())
    ax.set_xlim(-1.5, 1.5)
    ax.set_ylim(-1.5, 1.5)
    ax.set_aspect('equal')
    axes.append(ax)

fig.suptitle('2D Distribution of Winner Ideologies by Voting Method (Unified Color Gradient)', fontsize=16)
plt.tight_layout(rect=[0, 0.03, 1, 0.95])
plt.show()
{% endhighlight %}
</details>

![Ideological Distribution of Winners (2 Dimensions)](/assets/article_images/2025-06-19-images/2d_winner_ideologies.png "Ideological Distribution of Winners (2 Dimensions)")

Notice how in 2-dimensions, FPTP and RCV/IRV produce winners that deviate much more strongly from the center of the ideological axes, reflecting that these systems are much more inconsistent at selecting winners who are representative of the median voter. By contrast, the cardinal and Condorcet voting methods produce winner ideologies that are much more tightly clustered around the center and have little dispersion beyond even 0.25 SDs of voters' ideology in either direction.

On Wikipedia's article on <a href="https://en.wikipedia.org/wiki/Center_squeeze">center squeeze</a>, you can see similar plots produced for various voting systems, and it's much more clear that voting systems like FPTP and IRV produce "blanks" around the center for winners' ideologies (you can kind of see this in the plots I produced since the center of the plots of approval, STAR, and Condorcet voting are darker).

![Center Squeeze](/assets/article_images/2025-06-19-images/center_squeeze.png "Center Queeze")

## Closing Thoughts

Typically, when I say I dislike RCV, the knee-jerk reaction from my more liberal friends is that (1) I don't support any electoral reform, and (2) that I hate it when progressive candidates win. Neither of those is really true. More than anything, I'm disappointed that RCV has established itself as the mainstream electoral reform scheme, when social choice theorists have known for decades it doesn't really alleviate the most important problems of FPTP.

Another thought is why care about electoral reform at all, or why split hairs on whether it's RCV or a cardinal method. Like I mentioned in the article, I think a normative claim of democratic elections is that the candidates elected *should* be acceptable to most of the electorate. What "acceptable" means varies depending on your preference of a social choice criterion, but I think it's pretty clear-cut that cardinal methods like approval voting and STAR circumvent the spoiler effects that RCV purports but fails to solve. I'm also very concerned about polarization as a pressing political issue that has eroded trust in democratic institutions, and RCV tends to reward polarization rather than quell it. Fundamentally, like FPTP, RCV is a system where voters' choices will converge to strategic bullet voting among the top two perceived contenders. Despite its rank-based ballot, the underlying dynamics still punish voters for expressing support for less viable candidates, especially in competitive races.

If the goal of reform is to build a healthier, more representative democracy, then we shouldn't settle for a marginal improvement over FPTP. We should pursue systems that actually incentivize honesty, reward consensus, and eliminate the structural biases that distort voter intent and undermine public trust.

## Addendum: FairVote Lied to You

I first remember hearing about RCV through <a href="https://www.youtube.com/watch?v=MykMQfmLIro">Hasan Minhaj's show Patriot Act</a> on Netflix. Not knowing better at the innocent age of 17, I thought this was the election silver bullet that would solve all our problems with democracy, and indeed, an organization called FairVote seemed to agree, securing some key advocacy wins to get RCV implemented in various electoral races across the country, including New York City.

Not only does FairVote gun hard for RCV, but they also gun hard *against* alternatives like approval voting and score voting. However, after looking at their website for why they prefer RCV over cardinal methods, I can only conclude that they are either (1) run by complete and total morons who are too stupid to read decades of social choice theory literature, or (2) run by people who deliberately lie about RCV's alternatives because their preferred candidates are more likely to get elected under RCV.

Their examples for where <a href="https://fairvote.org/archives/alternatives-to-rcv/">score voting and approval voting fail</a>, while technically true, make completely unrealistic assumptions about "tactical voting." Why are the 98% of voters who don't really like Candidate A but hate Candidate B giving Candidate A a 1? Their own scenario describes the candidates as "mediocre," not "utterly destable to 98% of the electorate." They then lambast the 2% of strategic voters who prefer Candidate B for scoring B at 99 and A at 0. While technically example of how cardinal methods may not pick the majority rule winner, they are begging the question as to why we ought design an electoral system that *chooses* the majority rule winner. Clearly, 98% of voters hate both candidates! In fact 100% of voters gave Candidate A a score of 1 or below; why exactly should Candidate A be elected? What was stopping the 98% of voters from scoring the "mediocre" Candidate A much higher?

They have another article <a href="https://fairvote.org/resources/electoral-systems/ranked_choice_voting_vs_approval_voting/">outlining why they prefer RCV to approval voting</a>, and a lot of their criticism seems to be that in some select few elections where approval voting was piloted, a majority of voters voted for just one candidate, and that voters have different subjective senses of what "approval" means. Like, okay? If you want to give them more optionality, you can just move from binary approval voting to score voting. But RCV isn't immune from the very criticisms they levy against approval voting (on shaky grounds, might I add); voters in RCV also engage in strategic behavior, struggle with <a href="https://www.nytimes.com/2021/05/28/us/politics/ranked-choice-voting-new-york-mayoral-race.html">ballot exhaustion</a>, and often fail to rank multiple candidates, especially in down-ballot races.

My question is that if FairVote is an advocacy group that is supposed to be focused on electoral reform, why eschew an entire form of voting that has been championed by social theorists for decades? Why do they not only dogmatically attach themselves to RCV, but also actively lobby *against* initiatives that propose piloting approval voting or score voting programs in local elections? They both get to make claims against cardinal voting without any empirical support, and then also actively stop us from collecting empirical evidence about alternative voting systems.

To me, FairVote is a complete sham of an organization, and I see it as such a stain that they've successfully thrusted RCV into the mainstream while suppressing what I think are more holistic voting systems.

---

#### Footnotes
[^1]: <small> Though if you must know, I wasn't a huge fan of either Andrew Cuomo or Zohran Mamdani. I dislike Cuomo for obvious reasons (sex pest, leaving elders to die in nursing homes during COVID, NIMBY), and while I find Zohran incredibly likeable, it seems apparent to me that his proposals are very naive and <a href="https://www.maximumnewyork.com/p/how-im-voting-for-mayor-in-nycs-democratic?r=71wbe&utm_medium=ios&triedRedirect=true#:~:text=Why%20I%20will%20not%20vote%20for%20Zohran%20Mamdani">don't pass basic budget math.</a> More than Zohran winning, however, I am incredibly happy that Cuomo lost, because I think the Democratic establishment deserves to be punished for uniting around a scandal-ridden, utterly grotesque person who had the hubris to think he could cakewalk to victory off of name recognition alone and do no campaigning or outreach to his would-be constituents. (See <a href="https://www.natesilver.net/p/zohran-delivered-the-democratic-establishment">Nate Silver's article!</a>) Lest you think I'm writing this blogpost because I'm a closeted Cuomo-supporting sore loser, I would have probably ranked Zohran fifth and definitely not ranked Cuomo if I lived in New York (but again, I don't live in New York, so the fact that I have as elaborate of an opinion as I do just suggests I'm more terminally online than anything).
[^2]: <small> Pronounced *con-dore-say*. </small>
[^3]: <small>This also reveals a funny quirk about strategic voting under an IRV system. In many cases, it's actually optimal to rank candidates in the *reverse* order of your true preference. Imagine if all the Greene and Omar first-choice voters who ranked Manchin second reversed their ballot order (we'll also assume that first-choice Manchin voters reversed their ballot order). In that scenario, voters would have elected the Condorcet winner with a commanding 80% majority in the first round! The unfortunate strategy game that IRV makes you play is that your ranking order isn't actually based on your true preferences; smart voters will rank based on who they think will make it to the final round, and strategically rank their preferred candidate last.</small>
[^4]: <small>In practice, score voting and approval voting <a href="https://link.springer.com/article/10.1007/s00355-020-01269-9">give the same result in around 98% of elections.</a></small>
[^5]: <small> Tangential, but a common mistake I see among leftist voters is conflating their own preferred set of policy preferences from progressive candidates with those policy preferences being "good" or "correct," while having little regard for the actual budgetary or economic impacts of said policies (e.g., progressives want to raise the minimum wage, because they assume that policy brings higher wages to the working class, and so <a href="https://www.cityandstateny.com/policy/2025/02/mamdani-unveils-30-30-minimum-wage-push-part-mayoral-campaign/403015/">Zohran's plan to raise the minimum wage to $30/hr</a> is "good" and makes him the "objectively good" candidate, all while disregarding the actual effects of the policy on things like employment or prices).</small>
[^6]: <small>Most of the code in this section was generated with the help of GitHub Copilot!</small>
[^7]: <small>For approval voting, I set a threshold of 0.5, equal to the dispersion of ideological distribution. Basically, I assumed that if a candidate was greater than 1 standard deviation away from a voter in terms of ideology, the voter would not approve of them. For STAR voting, I calculated scores as a normalized version of a candidate's ideological distance from a voter's:  `1 - distances / distances.max()`</small>