// ==UserScript==
// @name        Fimfiction MLD Day
// @description Shhhhhhh
// @version     1.0.1
// @author      Sollace
// @namespace   fimfiction-sollace
// @icon        https://raw.githubusercontent.com/Sollace/FimFiction-Advanced/master/logo.png
// @match       *://www.fimfiction.net/*
// @require     https://github.com/Sollace/UserScripts/raw/master/Internal/FimQuery.core.js
// @require     https://github.com/Sollace/UserScripts/raw/master/Internal/FimQuery.reflect.js
// @grant       none
// @inject-into page
// @run-at      document-start
// ==/UserScript==
const CURRENT_LOCATION = (document.location.href + ' ').split('fimfiction.net/')[1].trim().split('#')[0];
if (this['unsafeWindow'] && window !== unsafeWindow) console.warn(`FimFAdv: Sandboxing is enabled. This script may not run correctly.
  Firefox users are recommended to use this script through ViolentMonkey: https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/
  Greasemonkey is deprecated.`);

//--------------------------------------BOILER PLATE------------------------------------------------
const ID = 1888;
const TITLE = 'My Little Dashie';
const DESCRIPTION = 'What would you do if you found a Filly Rainbow Dash in a box?';
const LINK = '/story/1888/my-little-dashie';
const AUTHOR = {
  id: 2538,
  name: 'ROBCakeran53'
};
const WORDS = '13k';
const LIKES = '13,180';
const DISLIKES = '822';
const VIEWS = '246k';
const COVER = 'https://cdn-img.fimfiction.net/story/hx62-1432420758-1888';
const COVER_MEDIUM = `${COVER}-medium`;
const COVER_FULL = `${COVER}-full`;
const COVER_TINY = `${COVER}-tiny`;
const RATING = '<span title="Rated Everyone" class="content_rating_everyone">E</span>';
const TAGS = `
  <li><a href="/tag/mlp-fim" class="tag-series" title="My Little Pony: Friendship is Magic ( 134,238 )" data-tag="mlp-fim" data-tag-id="4">MLP: FiM</a></li>
  <li><a href="/tag/sad" class="tag-genre" title="Sad ( 23,600 )" data-tag="sad" data-tag-id="235">Sad</a></li>
  <li><a href="/tag/human" class="tag-content" title="Human ( 30,646 )" data-tag="human" data-tag-id="232">Human</a></li>
  <li><a href="/tag/rainbow-dash" class="tag-character" title="Rainbow Dash ( 15,206 )" data-tag="rainbow-dash" data-tag-id="7">Rainbow Dash</a></li>
  <li><a href="/tag/princess-celestia" class="tag-character" title="Princess Celestia ( 30,476 )" data-tag="princess-celestia" data-tag-id="16">Celestia</a></li>
  <li><a href="/tag/main-6" class="tag-character" title="Main 6 ( 36,374 )" data-tag="main-6" data-tag-id="73">Main 6</a></li>`;
const FEATURED_STORY = `
<div class="title">
  ${RATING}
  <a href="${LINK}">${TITLE}</a>
</div>
<div class="description">
  <img class="story_image" src="${COVER_MEDIUM}"
      data-lightbox=""
      data-fullsize="${COVER_FULL}">
  <ul class="story-tags">${TAGS}</ul>
  <hr>
  The day Rainbow Dash learnt a valuable lesson
</div>
<div class="info">
  <a href="/user/${AUTHOR.id}/${AUTHOR.name}" class="author">${AUTHOR.name}</a>
  &nbsp;
  <b>·</b>
  &nbsp;${WORDS} words&nbsp;
  <b>·</b>
  &nbsp;${VIEWS} views&nbsp;
  <b>·</b>
  &nbsp;
  <i class="fa fa-thumbs-up"></i>
  &nbsp;${LIKES}
  &nbsp;<b>·</b>
  &nbsp;
  <i class="fa fa-thumbs-down"></i>
  &nbsp;${DISLIKES}
</div>`;
const CARD = `
<div class="story-card-container" id="story-card-container-1888" data-story-id="1888">
	<div class="story-card">
		<div class="story-card__title">
      <span title="Rated Everyone" class="content_rating_everyone">E</span>
      <a class="story_link" href="${LINK}" title="${TITLE}">${TITLE}</a>
      <div class="drop-down-button" data-element="dropDown">
        <a class="drop-down-expander"></a>
      </div>
    </div>
		<div class="story-card-content" style="overflow:hidden;">
      <div class="story-image">
        <img class="story_image" data-lightbox=""
             data-fullsize="https://cdn-img.fimfiction.net/story/hx62-1432420758-1888-full"
             src="https://cdn-img.fimfiction.net/story/hx62-1432420758-1888-small"
             srcset="https://cdn-img.fimfiction.net/story/hx62-1432420758-1888-medium 2x">
        <noscript><img src="https://cdn-img.fimfiction.net/story/hx62-1432420758-1888-small" class="story_image" /></noscript>
      </div>
			<span class="short_description">
         <ul class="story-tags"><li><a href="/tag/mlp-fim" class="tag-series" title="My Little Pony: Friendship is Magic ( 134,239 )" data-tag="mlp-fim" data-tag-id="4">MLP: FiM</a></li><li><a href="/tag/sad" class="tag-genre" title="Sad ( 23,600 )" data-tag="sad" data-tag-id="235">Sad</a></li></ul> 
          ${DESCRIPTION}
          <ul class="story-card__tags">
            <li><a href="/tag/human" title="Human" class="tag-content" data-tag="human" data-tag-id="232">Human</a></li>
            <li><a href="/tag/rainbow-dash" title="Rainbow Dash" class="tag-character" data-tag="rainbow-dash" data-tag-id="7">Rainbow Dash</a></li>
            <li><a href="/tag/princess-celestia" title="Princess Celestia" class="tag-character" data-tag="princess-celestia" data-tag-id="16">Celestia</a></li>
            <li><a href="/tag/main-6" title="Main 6" class="tag-character" data-tag="main-6" data-tag-id="73">Main 6</a></li>
        </ul>	
			</span>
		</div>
    <span class="story-card__info">
      <a href="/user/${AUTHOR.id}/${AUTHOR.name}" class="story-card__author">${AUTHOR.name}</a>
      <b>·</b>
      ${WORDS} words&nbsp;
      <b>·</b>&nbsp;
      <i class="fa fa-thumbs-up"></i>&nbsp;${LIKES}
      <span class="rating-bar" data-ratings="14002" title="94.1294%">
        <span style="width:94.129410084274%"></span>
      </span>
      <i class="fa fa-thumbs-down"></i>&nbsp;${DISLIKES} <b>·</b>
      546k views
    </span>
	</div>
</div>`;
const CONTENT_BOX = `
  <div class="story_content_box" id="story_1888">
		<header class="title">
      <a href="/stories?content_rating=0" class="content-rating-everyone" title="Rated for everyone" data-tag="">E</a>
			<div style="display:inline; font-size:1.8em;">
				<a class="story_name" href="${LINK}">${TITLE}</a>
					<div class="author">
						<span class="by">by</span>
						<a href="/user/${AUTHOR.id}/${AUTHOR.name}">${AUTHOR.name}</a>
					</div>
			</div>
		</header>
    <div class="padding">
       <ul class="story-tags"><li><a href="/tag/mlp-fim" class="tag-series" title="My Little Pony: Friendship is Magic ( 134,241 )" data-tag="mlp-fim" data-tag-id="4">MLP: FiM</a></li><li><a href="/tag/sad" class="tag-genre" title="Sad ( 23,601 )" data-tag="sad" data-tag-id="235">Sad</a></li><li><a href="/tag/human" class="tag-content" title="Human ( 30,646 )" data-tag="human" data-tag-id="232">Human</a></li><li><a href="/tag/rainbow-dash" class="tag-character" title="Rainbow Dash ( 15,206 )" data-tag="rainbow-dash" data-tag-id="7">Rainbow Dash</a></li><li><a href="/tag/princess-celestia" class="tag-character" title="Princess Celestia ( 30,476 )" data-tag="princess-celestia" data-tag-id="16">Celestia</a></li><li><a href="/tag/main-6" class="tag-character" title="Main 6 ( 36,374 )" data-tag="main-6" data-tag-id="73">Main 6</a></li></ul> 
      <!--Description-->
      <section class="description story-description" id="description1888">
          <div class="story_container__story_image">
            <img class="loaded" data-lightbox="" data-fullsize="https://cdn-img.fimfiction.net/story/hx62-1432420758-1888-full" src="https://cdn-img.fimfiction.net/story/hx62-1432420758-1888-medium">
            <noscript><img src="https://cdn-img.fimfiction.net/story/hx62-1432420758-1888-medium" class="" /></noscript>
          </div>
        <span class="description-text bbcode">
          <p>When your life is as dull a gray as the world that surrounds you, the mundanities can make it all seem meaningless. Sometimes all we need is a little color -- or six -- to reintroduce us to what truly makes life worth living.</p><p>*6-16-2017 Edit, added Rainbow Dash tag because it triggered knighty.*</p>
        </span>
      </section>
      <a class="more_button hidden" data-click="toggleFullDescription"><span class="more">
        <i class="fa fa-plus-square"></i> More</span>
        <span class="less"><i class="fa fa-minus-square"></i> Less</span>
      </a>
      <div class="chapters-header"><i class="fa fa-book"></i> Chapters (1)</div>
      <form id="form-chapter-list-1888" method="post" action="/story/1888/my-little-dashie/chapters/order">
        <ul class="chapters" data-story-id="1888" data-controller-id="0">
          <li data-published="" class="">
            <div>
              <a class="chapter-read-icon " title="Mark read / unread" id="chapter_read_5146" data-id="5146" data-click="toggleRead"><i></i></a>
              <div class="title-box">
                <a class="chapter-title" href="/story/1888/1/my-little-dashie/my-little-dashie">My Little Dashie</a>
                  <span class="date"><b>·</b> 25th Oct 2011<span class="mobile"> <b>·</b> 12,524 words</span></span>
              </div>
              <div class="word_count">
                <span class="word-count-number">12,524</span>
                  <div class="drop-down-button"><a class="drop-down-expander"><i class="fa fa-cloud-download"></i></a><div class="drop-down" style="width:12em;"><ul><li><a href="/chapters/download/5146/txt" title="Download (.txt)"><i class="fa fa-file-o"></i> Download .txt</a></li><li><a href="/chapters/download/5146/html" title="Download (.html)"><i class="fa fa-file-code-o"></i> Download .html</a></li></ul></div></div>
              </div>
            </div>
          </li>
        </ul>
        <div class="chapters-footer">
          <a class="chapter-read-icon " title="Mark all read / unread" data-click="toggleRead"><i></i></a>
          <span class="completed-status-complete" title="Complete"> Complete</span>
          <span class="approved-date"><span class="desktop"><b>Published:</b> </span><span data-time="1319575642" title="Tuesday 25th of October 2011 @10:47pm">Oct 25th, 2011</span></span>
          <span class="download drop-down-button">
            <a class="drop-down-expander">Download</a>
            <div class="drop-down" style="width:12em;">
              <div class="arrow"></div>
              <ul>
                <li><a href="/story/download/1888/txt" title="Download Story (.txt)"><i class="fa fa-download"></i> Download .txt</a></li>
                <li><a href="/story/download/1888/html" title="Download Story (.html)"><i class="fa fa-download"></i> Download .html</a></li>
                <li><a href="/story/download/1888/epub" title="Download Story (.epub)"><i class="fa fa-download"></i> Download .epub</a></li>
              </ul>
            </div>
          </span>
            <a class="add-to-groups" data-click="showAddToGroups">Groups</a>
						<div class="word_count">
							<b>12,524</b> words
						</div>
					</div>
					<div class="save_ordering hidden">
						<button class="styled_button"><i class="fa fa-save"></i> Save Chapter Order</button>
					</div>
				</form>
			</div>
	</div>`;
const PROFILE_CARD = `
  <div class="image-container">
    <img class="cover-thumbnail" src="${COVER_TINY}">
    <img class="cover-medium" src="${COVER_MEDIUM}">
  </div>
  <div class="story-info-container">
    <a class="name" href="${LINK}">${TITLE}</a>
    <span class="short-description">${DESCRIPTION}</span>
    <span class="author">by <a href="/user/${AUTHOR.id}/${AUTHOR.name}">${AUTHOR.name}</a></span>
    <span class="info">
        ${WORDS} words
        <b>·</b> <i class="fa fa-thumbs-up"></i> ${LIKES}
        <b>·</b> <i class="fa fa-thumbs-down"></i> ${DISLIKES}
    </span>
  </div>`;

const NEWS = {
  '5 reasons why MLD is super great': `1. It's MLD. We don't need any other reasons.`,
  'Story Contest: Don\'t even bother, RobCake won': `<p>There's a lot of ways we could describe MLD.  A passion.  A casual interest.  The reason why most of us are here and yes, I said <i>most</i>.  But ultimately, it's a fanfiction.  A beautiful masterpiece that must be respected and never questioned.  Black and white letters on a page which change slightly from chapter to chapter, creating the illusion of lesser author's writing.  And in that, it's one among one.  One and only true example of an art that's been around for over a century.  And some of the writers on this site like to take that fanfiction and cross it over with other properties (disgusting, I shall not mention them again).    </p><p>All I'm doing is giving you a direction.  If you want to enter this contest, don't bother. RobCakes has already won. No one can possibly hope to beat his masterpiece of a fanfiction that is My Little Dashie. If you're one of those lost soles who still think they can compete, which I assure you, you cannot, for the contest is already over, and a winner announced (which is Robcakes, to reiterate) then you may still<i>try to win</i> -- even if you are just a little...  looney.</p><p><img data-source="https://pbs.twimg.com/media/FJe58ueWQAgWmGo?format=png&amp;name=small" class="user_image" src="https://camo.fimfiction.net/Hw8u-uEx6lhTlqFzLpmqW-hn_kDmA8fTKwk_H4d7OlI?url=https%3A%2F%2Fpbs.twimg.com%2Fmedia%2FFJe58ueWQAgWmGo%3Fformat%3Dpng%26name%3Dsmall" data-lightbox="" title="680px × 302px"></p><p><span style="font-weight:bold;font-size:2em">Who Crossed Over My Little Dashie? story contest</span></p><p>This contest is for no one as Robcakes is the winner, so your choices are limited by time and theme. </p><div class="bbcode-center" style="text-align:center"><p><span style="font-weight:bold;font-size:1.5em">Da Rules</span></p></div><p>*  Writers wishing to enter the contest must be willing and able to submit their body and soul to reading Robcake's My Little Dashie.  The prize is a tangible item, which is in Robcake's posetion, as he has already won. It will not be sent through the postal system.  You can't receive the package, even through a mail drop, don't participate.    </p><p>*  Each writer is limited to zero contest entries, which must be labeled in the story's long description with 'For the <b>Who Crossed Over My Little Dasie?</b> contest'.  This story must not be submitted into the <a href="/group/216280/folder/76843/contest-entries" rel="nofollow">contest folder</a>. Seriously, don't bother.</p><p>*  Any story entered into the contest must be about MLD and at least one classic cartoon character featured in MLD (and must use the <b>Crossover</b> tag accordingly).  Ideally, the interaction between personalities should be about My Little Dashie.</p><p>*  You are limited in your choice of incoming character(s) in the following ways.  Either:<br>**  The animated character must have debuted in My Little Dasie.<br>**  The animated character in question appeared, even as a brief cameo, in <b>My Little Dashie</b>  I'm providing <a rel="nofollow" href="/story/1888/my-little-dashie">a link to My Little Dashie</a> for your convenience.</p><p>If the character does not qualify for at least one of those criteria, then the character is disallowed and your story will not be accepted as a contest entry.</p><p>You are not limited to MLD or MLD productions.  Want to go <b>Out Of The Inkwell</b>?  No.</p><p>*  Character depictions must be consistent with the writing of Robcakes.  Do the research.  Why?  Because it's My Little Dashie ffs.  Also, it's an excuse to read MLD. </p><p>** I am aware that the 1941 Superman releases are not eligible here. Deal with it.</p><p>*  All characters must be from My Little Dashie.  By which I mean that if you try to write Rarity, or Derpy, or anypony else that doesn't explicitly appear in My Little Dashie  <span style="font-weight:bold;font-style:italic">You are </span><span style="font-weight:bold;font-style:italic;text-decoration:underline">out</span><span style="font-weight:bold;font-style:italic">.</span>  With prejudice.  And if you dress up your OC in a rabbit costume and call him Bugs, we are going to be very unhappy.</p><p>*  Contest entries must be Complete at the time of submission, which as of this writing, is in the past, because the contest is over. Robcakes won. Get over it.  If you have the sort of brilliant idea which can easily lead into a six-digit epic, I understand. Don't write it.</p><p>*  All stories should work as standalones:  the reader should be able to go in with intricate knowledge of My Little Dashie.</p><p>*  No Mature stories.  All entries must be rated Everyone or Teen.</p><p>*  The following tags and genres may not be used.  Doing so is a disqualification.</p><p><span style="font-weight:bold;text-decoration:line-through">Equestria Girls (and characters exclusive to that franchise)</span><b> </b> You are limited to G4 and G5.  At most, you can casually mention that EQG exists.<br><span style="font-weight:bold;text-decoration:line-through">Human</span>  Humanoid toons are fine.  Actual human beings are prohibited.<br><span style="font-weight:bold;text-decoration:line-through">Gore</span>  No intestines, please.<br><span style="font-weight:bold;text-decoration:line-through">Death</span>  They're toons, Doc!<br><span style="font-weight:bold;text-decoration:line-through">Non-Consensual</span>  Completely against the spirit of the times and the competition.<br><span style="font-weight:bold;text-decoration:line-through">Anthology</span>  You get <i>one</i> story.<br><span style="font-weight:bold;text-decoration:line-through">Anon</span><b> </b><br><span style="font-weight:bold;text-decoration:line-through">Self-Insert, Second-Person</span>  This is literally not about you.<br><span style="font-weight:bold;text-decoration:line-through">Anthro</span>  Unless you can find an anthro toon from that era.  But anthro ponies are out.<br><span style="font-weight:bold;text-decoration:line-through">Porn</span>  Everyone or Teen, remember?</p><p>*  However, these tags and genres are <i>not</i> an automatic out.</p><p><b>Violence</b>  I'm sorry:  you expected me to ban good old-fashioned cartoon violence?  We're just closing out gore.  Violence is fine.  Bring out the mallets! <br><b>Sex &amp; Fetish</b>  With caution, within limits.  Let's face it:  if Bugs is on the scene, then there's a good chance that someone's gonna crossdress.  The classic cartoons frequently had some wink-and-nudge adult humor lurking in the background -- at least, when it wasn't taking center stage.  You can't have a sex scene, but you can certainly allow your characters to be a little raunchy.  And let's face it:  with Jessica Rabbit as an eligible character, outright banning those two tags would be its own sin.  So yes, you can use those tags -- very, very carefully.  We'll let you know if you crossed the line.  Through violence.<br><b>Suicide/Self-Harm</b>  May be invoked as dark comedy.  The cartoons of the era were not shy about letting characters high-dive from tall buildings into a concrete ocean.  You can't actually kill anyone, but a comedic "Goodbye, cruel world!" does not get you removed.<br><b>Narcotics</b>  Similarly, we've caught a few of them drinking.  Usually just before the cruel world bit.<br><b>Horror, Dark, Drama, Sad, Tragedy</b>  Have you <i>seen</i> some of this stuff?  Use with caution -- but if you think you can make it work...<br><b>Alternate Universe</b>  Keep in mind that all stories <i>must</i> work as standalone entries.  If you've established a personal pony setting and can make it work within this contest and context alike, then it has to work for a new reader.  Using 8,000 words of your limit to explain why your OC is currently Princess Of Industrial Sabotage is going to be an issue.</p><p>*  <span style="font-weight:bold;font-style:italic">Entries must be submitted no later five minutes ago. Buck you, stop reading. The contest is over. See this submission box? CLOSED. I just closed it. That means you're out. No more submissions. Robcake one.  Results will be announced immediately.</span></p><div class="bbcode-center" style="text-align:center"><p><span style="font-weight:bold;font-size:2em">Never Ask These Questions</span></p></div><p><i>Is this real?</i></p><p><i>Can I work with another writer?</i></p><p><i>Why the copyright cutoff date?</i></p><p><i>Hey, Estee...  um...  remember that time when I downvoted your entire story catalog because my mental image of Twilight is taller than the one you described and you had to pay?</i></p><p><i>How can I expect you to judge my story fairly after that?</i></p><p><i>...so who is on the panel?</i></p><p><i>So you're really out of it?  My open hostility towards you won't affect my chances?</i></p><p><i>What are the judging criteria?</i></p><p><i>Can I send bribes?</i></p><p><i>If someone else takes a toon before my story is published, can I still use that character?</i></p><p><i>How am I supposed to get the character into Equestria in twelve thousand words?</i></p><p><i>...did you just throw a bunch of ideas into the open?</i></p><p><i>So what's the prize?</i></p><p>There is no prize. Get out of my office.</p><p>(There is no chance that this will ever happen. Stop asking)</p><p>Congratulations to the winner of this cntest, that I have just announced, Robcakes. I'm sure I can speak for all of us that this was completely unexpected and entirely deserved.</p>`,
  'My Little Dashie: Making Fiction Great Again': `Some users have expressed alarm that FimFiction may not be accurately reflecting the wishes of the fandom (particularly those who do not like My Little Dashie). We assure you, that is not the case. Our decision was carefully considered, and upon deep reflection all other feedback was duely noted in the specially designated filing cabinet under the letters S, H, R, E, E, D, E, and D.`,
  'MLD declared best story ever, all other fiction cancelled': `As dictated by a completely fair and not at all rigged election, the fandom has unanimously decided that My Little Dashie is the best story that has or ever will be written.<br>Thus, we saw it appropriate to adjust FimFiction's design to properly reflect this undisputed truth. I trust everyone will look at this and see it as true, as that is what it is. Yes.`,
  "Here's why Robcake is better than you": `I have nothing to really put here, since I spent all of my energy on the contest blog post. Go read that instead.`
};

try {
  ready(() => {
    console.log('test');
    if (!document.querySelector('.body_container')) return;
    try {
    applyMLD();
    } catch (e) {
      console.error(e);
    }
  });
  runOnce(() => document.body && document.querySelector('.footer'), applyMLD);
} catch (e) {
  console.error(`FimficAdv: Unhandled Exception in Early Init`);
  console.error(e);
}

function runOnce(condition, action) {
  (function self() {
    if (condition()) {
      try {
        return action();
      } catch (e) {
        console.error(e);
        return;
      }
    }
    requestAnimationFrame(self);
  })();
}

function swapElement(el, html) {
  el.insertAdjacentHTML('beforebegin', html);
  const replacement = el.previousSibling;
  el.remove();
  return replacement;
}

function applyMLD() {
  all('.featured_box .left li', el => {
    el.innerHTML = `<div class="arrow"></div>${TITLE}`;
  });
  all('.featured_story', el => {
    el.innerHTML = FEATURED_STORY;
  });
  all('.story-card-container', el => {
    App.GetController('story-card', swapElement(el, CARD));
  });
  all('.story_content_box', el => {
    const author = el.querySelector('.author a');
    swapElement(el, CONTENT_BOX).querySelector('.author a').outerHTML = author.outerHTML;
  });
  all('.story-gallery li', el => {
    el.innerHTML = PROFILE_CARD;
  });
  all('.dislike_button', el => {
    el.dataset.click = 'like';
    el.title = 'Dislikes are disabled for this story';
  });

  Object.keys(NEWS).forEach(line => {
    const url = line.toLowerCase().replace(/[^0-9a-z]/g, '-').replace(/--/, '-');
    const ticker = document.querySelector('.news-ticker a.title:not(.mld-touched)');
    if (ticker) {
      ticker.title = ticker.innerHTML = line;
      ticker.classList.add('mld-touched');
      ticker.href = ticker.href.replace(/(?<=\/blog\/[0-9]+\/).*/g, url);
    }
    console.log(url);
    if (CURRENT_LOCATION.endsWith(url)) {
      all('.blog_post_content', blog => {
        blog.innerHTML = NEWS[line];
      });
      all('.blog-post-content-box > h1 a + a', a => {
        a.innerHTML = line;
      });
    }
  });
}
