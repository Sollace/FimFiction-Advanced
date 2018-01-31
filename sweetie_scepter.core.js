// ==UserScript==
// @name        Sweetie Scepter
// @description Super Secret Stuff
// @version     4.3.2d
// @author      Sollace
// @namespace   fimfiction-sollace
// @icon        https://raw.githubusercontent.com/Sollace/FimFiction-Advanced/master/logo.png
// @include     /^http?[s]://www.fimfiction.net/.*/
// @require     https://github.com/Sollace/UserScripts/raw/master/Internal/FimQuery.core.js
// @require     https://github.com/Sollace/FimFiction-Advanced/raw/master/settings_man.core.js
// @grant       none
// @run-at      document-start
// ==/UserScript==

if (getSweetieEnabled()) document.addEventListener("DOMContentLoaded", setupSweetie);

function jule(s) {
  let a = '', len = s.length;
  for (let i = 0; i < len; i += 2) a += (i < len - 1 ? s[i + 1] : '') + s[i];
  return a;
}

function getSweetieEnabled() {return settingsMan.bool('sweetie_staff_enabled', false);}
function setSweetieEnabled(e) {
  settingsMan.setB("sweetie_staff_enabled", e.target.checked, false);
  if (!e.target.checked) {
    settingsMan.remove("sweetie_posX");
    settingsMan.remove("sweetie_posY");
    settingsMan.remove("sweetie_img_index");
  }
  const belle = document.querySelector('#belle');
  if (belle) {
    belle.style.display = e.target.checked ? "block" : "none";
  } else if (e.target.checked) {
    setupSweetie();
  }
}

function setupSweetie() {
  const GITHUB = '//raw.githubusercontent.com/Sollace/FimFiction-Advanced/Dev';
  
  let x, y;
  let prefX = 0, prefY = 0;
  
  let lastX = -1, lastY = -1;
  let lastClientX = -1, lastClientY = -1;
  
  let selected_image_index = 0;
  
  let extra_key = 0;
  let no = false;

  const imgLabels = 'Sweetie Belle;Scootaloo;Apple Bloom;Applejack;Twilight Sparkle'.split(';');
  const helpContent = 'iPkcpuD/or pmiga;ePSCA Eo(ev rmiga)eW-bolb emIgaseS;IHTFS+APECC-ooik elCciek;r+CPSCA-EeHrastH;S+APECS-ahekS;ahekV girouols-yhTsip ga;e+QPSCAE';
  
  const imgs = [
    '#scepter_base, #scepter_trim, #eyes_filly, #sb',
    '#scepter_base, #scepter_trim, #eyes_filly, #sc, #sc_back',
    '#scepter_base, #scepter_trim, #eyes_filly, #ab',
    '#scepter_base, #scepter_trim, #eyes_mare, #aj, #aj_back, #aj_over',
    '#scepter_base, #scepter_trim, #eyes_mare, #eyes_mare_bottom, #ts, #ts_back',
  ];
  
  const randomX = () => document.scrollingElement.scrollLeft + (Math.random() * document.body.clientWidth);
  const randomY = () => document.scrollingElement.scrollTop + (Math.random() * document.body.clientHeight);
  const rRGB = () => Math.floor(Math.random() * 255);
  const getMaxX = () => document.body.offsetWidth - (belle.offsetWidth * 0.75);
  const getMaxY = () => document.body.offsetHeight - (belle.offsetHeight * 0.75);
  const clamp = (v, min, max) => v < min ? min : v >= max ? max : v;
  
  const songs = (_ => {
    let player = null;
    return {
      play: (ytid, ended, loaded) => {
        if (!player) {
          document.body.insertAdjacentHTML('beforeend', '<iframe style="display:none;" id="song_frame"></iframe>');
          player = document.body.lastChild;
        }
        
        if (player.dataset.ytid == ytid) return;
        player.dataset.ytid = ytid;
        player.src = `//www.youtube.com/embed/${ytid}?autoplay=1&enablejsapi=1`;
        const ready = () => {
          loaded();
          player.removeEventListener('load', loaded);
        };
        player.addEventListener('load', loaded);
        player.addEventListener('ended', ended);
        return player;
      },
      stop: () => {
        if (!player) return;
        player.dispatchEvent(new Event('ended'));
        player.parentNode.removeChild(player);
        player = null;
      }
    };
  });
  
  const cookieClicker = (_ => {
    const pointType = [0,0];
    
    const baseCursorUpgradeCost = 10;
    let cursorUpgradeCost = 0;
    const baseCursorCost = 4;
    let cursorCost = baseCursorCost;

    let score = 0;
    let bank = 0;
    
    let gameBg = null;
    
    function getPointsName() {
      if (pointType[0] && pointType[1]) return 'Cookies/Ducks';
      if (pointType[0]) return 'Cookies';
      return 'Ducks';
    }
    
    function spawnCursor(smart) {
      var base = baseCursorCost;
      if (smart) bas *= 10;
      cursorUpgradeCost += base;
      document.body.insertAdjacentHTML('beforeend', `<div class="gameObj cursor_container">
  <div data-level="1" class="cursor click${smart ? ' smart' : ''}">
    <img class="nopickup" src="${GITHUB}/assets/cursor.png"></img>
  </div>
  <div class="label">
    <div>level <span class="level">1</span></div>
    <div>
      <a>Sell for <span class="value">${base}</span></a>
    </div>
  </div>
</div>`);
      const cursor = document.body.lastChild;
      const cursorCursor = cursor.querySelector('.cursor');
      cursor.addEventListener('remove', () => cursor.dataset.deleted = '1');
      cursor.querySelector('a').addEventListener('click', e => {
        const value = parseInt(cursorCursor.dataset.value) * base;
        bank += value;
        const pos = offset(cursor);
        plusOne(pos.left, pos.top, value);
        cursor.dispatchEvent(new Event('remove'));
        cursor.parentNode.removeChild(cursor);
        e.preventDefault();
      });
      const placing = event => {
        cursor.style.top = event.pageY + 'px';
        cursor.style.left = event.pageX + 'px';
      };
      const mouseup = event => {
        document.removeEventListener('mousemove', placing);
        document.removeEventListener('mouseup', mouseup);
        cursorCursor.classList.remove('click');
        checkClick();
        event.preventDefault();
      };

      document.addEventListener('mousemove', placing);
      document.addEventListener('mouseup', mouseup);
    }


    function checkClick(cursor) {
      const ref = offset(cursor);
      const distance = 100 + (50 * parseInt(cursor.dataset.level));
      let clicks = 5;
      [].some.call(document.querySelectorAll('.cookie'), (a) => {
        if (clicks <= 0) return true;
        if (!cursor.classList.contains('smart') || !a.classList.contains('wrath')) {
          const coo = offset(a);

          const cookieX = coo.left + a.offsetWidth/2;
          const cookieY = coo.top + a.offsetHeight/2;

          const dist = Math.sqrt(Math.pow(ref.left - cookieX, 2) + Math.pow(ref.top - cookieY, 2));
          if (dist <= distance) {
            a.dispatchEvent(new Event('mousedown', {pageX: cookieX, pageY: cookieY}));
            clicks--;
          }
        }
      });

      cursor.classList.add('click');
      setTimeout(() => cursor.classList.remove('click'), 500);

      if (cursor.dataset.deleted != '1') {
        setTimeout(() => checkClick(cursor), 5000);
      }
    }
    
    function endGame() {
      songs.stop();
      all('.gameObj', gameBg, a => a.dispatchEvent(new Event('remove')));
      gameBg.parentNode.removeChild(gameBg);
      gameBg = null;
      bank = score = 0;
      cursorUpgradeCost = baseCursorUpgradeCost;
      cursorCost = baseCursorCost;
      say('Game Over :c', 2000, true);
    }
    
    const purchase = (cost, multiplier, smart) => {
      if (bank >= cost) {
        bank-= cost;
        cursorCost += multiplier;
        say(`${getPointsName()}: ${bank}</br>${getPointsName()} Clicked: ${score}`);
        spawnCursor(smart);
        holder.innerHTML = '';
        holder.parentNode.opacity = 0;
        holder.removeEventListener('click', handler);
      }
    };
    const actions = {
      buyCursor: _ => purchase(cursorCost, 4, false),
      buySmartCursor: _ => purchase(cursorCost * 10, 4, true),
      upgradeCursor: _ => {
        const totalCursors = document.querySelectorAll('.cursor').length;
        bank -= cursorUpgradeCost * totalCursors;
        all('.cursor', a => {
          const level = parseInt(a.dataset.level) + 1;
          if (level < 6) {
            a.dataset.level = level;
            a.parentNode.querySelector('.level').innerHTML = level;
            a.parentNode.querySelector('.value').innerHTML = level * baseCursorCost;
            if (level == 5) {
              cursorUpgradeCost -= baseCursorUpgradeCost * (level - 1);
            } else {
              cursorUpgradeCost += baseCursorUpgradeCost;
              a.style.transform = `scale(${level},${level})`;
            }
          }
        });
        say(`${getPointsName()}: ${bank}</br>${getPointsName()} Clicked: ${score}`);
      }
    };
    
    function buildShop(holder) {
      if (bank >= cursorCost) {
        holder.insertAdjacentHTML('beforeend', `<button data-click="buyCursor" class="styled_button">Buy 1 Cursor (${cursorCost})</button>`);
      }
      if (bank >= cursorCost * 2) {
        holder.insertAdjacentHTML('beforeend', `<button data-click="buySmartCursor" class="styled_button">Buy 1 Smart Cursor (${cursorCost * 10})</button>`);
      }
      if (document.querySelector('.cursor') && cursorUpgradeCost && bank >= cursorUpgradeCost) {
        holder.insertAdjacentHTML('beforeend', `<button data-click="upgradeCursor" class="styled_button">Upgrade Cursors (${cursorUpgradeCost})</button>`);
      }

      addDelegatedEvent(holder, 'button[data-click]', 'click', e => {
        actions[e.target.dataset.click]();
      });
    }

    
    function spawnCookie(scepter, x, y) {
      if (scepter && document.querySelector('.cookie')) {
        if (bank < 1) return;
        say(`${getPointsName()}: ${--bank}</br>${getPointsName()} Clicked: ${score}`);
      }

      options(buildShop);

      let diff = Math.log(score ? score : 1) * 300;
      let fadeTime = Math.max(2000 - diff, 100);
      let sitTime = Math.max(8000 - (diff * (score/100 < 1 ? 1 : score/100)), 50);
      let wrath = false;

      if (document.querySelectorAll('.cookie').length > document.querySelectorAll('.wrath').length) {
        for (var i = 0; i < (score/100 - 1) && !wrath && i < 10; i++) {
          wrath |= (Math.random() * 15 < 2);
        }
      }
      document.body.insertAdjacentHTML('beforeend', `<img src="${GITHUB}/assets/${wrath ? 'cookie' : 'wrath'}.png"
class="gameObj cookie nopickup${wrath ? 'wrath' : ''}"
style="position:absolute;transition:opacity ${fadeTime/1000}s linear, visibility ${fadeTime/1000}s linear;opacity:0;visibility:hidden"></img>`);
      let cook = document.body.lastChild, timer = null;

      x -= cook.offsetWidth / 2;
      y -= cook.offsetHeight /2;

      cook.style.top = `${y}px`;
      cook.style.left = `${x}px`;

      cook.addEventListener('mousedown', (e, a) => {
        e.preventDefault();
        if (!e.pageY) {
          e.pageY = a.pageY;
          e.pageX = a.pageX;
        }
        cook.parentNode.removeChild(cook);

        if (timer) clearTimeout(timer);
        timer = cook = null;

        score++;
        if (wrath) {
          let newBank = Math.floor(bank * 0.8);
          plusOne(e.pageX,e.pageY, newBank - bank, a => a.style.color = 'red');
          bank = newBank;
        } else {
          plusOne(e.pageX,e.pageY, 1);
          bank++;
          if (Math.random() < 0.5) {
            songs.play('eaK5_eJRzmA', () => belle.classList.remove('musical'), () => belle.classList.add('musical'));
          }
        }

        say(`Cookies: ${bank}</br>Cookies Clicked: ${score}`);
        let max = belle.classList.contains('musical') ? 3 : 1;
        for (let i = 0; i < max; i++) {
          if (Math.random() * 16 < max) spawnCookie(false, randomX(), randomY());
        }
        spawnCookie(false, randomX(), randomY());
      });

      requestAnimationFrame(() => {
        cook.style.opacity = 1;
        cook.style.visibility = '';
        timer = setTimeout(() => {
          if (!cook) return;
          cook.style.opacity = 0;
          timer = setTimeout(() => {
            if (!cook) return;
            cook.parentNode.removeChild(cook);
            if (!document.querySelector('.cookie')) {
              if (cook.classList.contains('wrath')) {
                spawnCookie(false, randomX(), randomY());
              } else {
                endGame();
              }
            }
          }, fadeTime);
        }, fadeTime + sitTime);
      });
    }
    
    function startGame() {
      document.body.insertAdjacentHTML('beforeend', '<div id="game-background" class="dimmer" style="background:none;display:block"></div>');
      gameBg = document.body.lastChild;
    }
    
    return () => {
      if (!gameBg) startGame();
      spawnCookie(true, lastX, lastY);
    };
  })();
  
  const toggleHearts = (_ => {
    let hearter = null;
    return _ => {
      if (hearter) {
        clearInterval(hearter);
        hearter = null;
      } else {
        hearter = setInterval(() => plusOne(Math.random() * document.body.clientWidth, Math.random() * document.body.clientHeight, '?', a => {
          a.style.fontFamily = 'FontAwesome';
          a.style.fontSize = `${10 + Math.random() * 50}px`;
          a.style.color = `rgb(${rRGB()},${rRGB()},${rRGB()})`;
          a.style.position = 'fixed';
        }), 100);
      }
    };
  })();
  
  const shake = (_ => {
    let shaken = 0;
    let shakeCount = 0;
    return () => {
      if ((Math.floor(Math.random() * 31)) == 5) {
        shaken = (shaken + 1) % 3;
        if (shakeCount >= 0) shakeCount++;
        var count = 3 + Math.floor(Math.random() * 5) + 3 * shaken;
        all('.body_container, .footer', a => a.style.animation = 'shake_shake 0.17s linear ' + count);
        setTimeout(() => all('.body_container, .footer', a => a.style.animation = ''), count * 170);
      }
      if (shakeCount >= 20) {
        shakeCount = -1;
        say("Woah!</br>I'm starting to feel a little dizzy here...", 5000);
      }
    };
  })();
  
  const grabber = (grabbedImage => {
    return {
      grabbed: _ => !!grabbedImage,
      grab: img => {
        if (img.classList.contains('nopickup')) return;
        if (img.dataset.dragged) {
          img.classList.add('grabbed-image');
          img.parentNode.appendChild(img);
          img.style.top = (lastY - img.offsetHeight/2);
          img.style.left = (lastX - img.offsetWidth/2);
          grabbedImage = img;
          return;
        }

        const result = img.cloneNode();
        result.setAttribute('class', 'grabbed-image');
        result.removeAttribute('id');
        result.removeAttribute('data-lightbox');
        result.dataset.dragged = true;
        document.body.appendChild(result);
        result.style.width = img.offsetWidth;
        result.style.height = img.offsetHeight;
        result.style.top = (lastClientY - img.offsetHeight/2);
        result.style.left = (lastClientX - img.offsetWidth/2) 
        result.addEventListener("click", e => {
          if (e.shiftKey) {
            if (grabbedImage == result) grabbedImage = null;
            return result.parentNode.removeChild(result);
          }
          if (grabbedImage == result) {
            grabbedImage.classList.remove('grabbed-image');
            grabbedImage = null;
          } else {
            result.classList.add('grabbed-image');
            result.parentNode.appendChild(result);
            grabbedImage = result;
          }
        });
        grabbedImage = result;
      },
      drop: _ => {
        grabbedImage.style.top = document.body.scrollTop + grabbedImage.offsetTop;
        grabbedImage.style.top = document.body.scrollLeft + grabbedImage.offsetLeft;
        grabbedImage.classList.remove('grabbed-image');
        grabbedImage = null;
      },
      move: event => {
        if (!grabbedImage) return;
        grabbedImage.style.top = `${event.pageY - grabbedImage.offsetHeight/2}px`;
        grabbedImage.style.left = `${event.pageX - grabbedImage.offsetWidth/2}px`;
      }
    };
  })();
  
  const belle = (_ => {
    document.body.insertAdjacentHTML('beforeend', `<div id="belle" style="top:-1px;left:-1px;">
        ${svg()}
        ${['options','speech'].map(a => `<div class="${a}_container"><div class="${a}" ></div></div>`).join('')}
    </div>`);
    const dom = document.body.lastChild;
    
    let dragging = false;
    let timestamp;
    
    const mouseMove = event => {
      setPos(event.clientX - x, event.clientY - y);
      grabber.move(event);
      if (lastX >= 0 && lastY >= 0) {
        const difX = Math.pow(event.pageX - lastX, 2);
        const difY = Math.pow(event.pageY - lastY);
        if (Math.sqrt(difX + difY) / (Date.now() - timestamp) > 30) shake();
      }

      lastClientX = event.clientX;
      lastClientY = event.clientY;
      lastX = event.pageX;
      lastY = event.pageY;
      timestamp = Date.now();
    };
    const toggleIframes = v => all('iframe', me => me.style.pointerEvents = v ? 'none' : '');
    const stopMoving = _ => {
      dragging = false;
      document.body.removeEventListener('mousemove', mouseMove);
      toggleIframes(false);
      lastX = -1;
    };
    
    dom.addEventListener('mousedown', event => {
      dragging = true;
      toggleIframes(true);
      x = event.clientX - parseInt(dom.style.left);
      y = event.clientY - parseInt(dom.style.top);
      if (hitDetector.isHit(event)) {
        document.body.addEventListener('mousemove', mouseMove);
        event.preventDefault();
      }
    });

    document.body.addEventListener('mousemove', event => {
      dom.style.pointerEvents = hitDetector.isHit(event) ? '' : 'none';
    });
    
    document.body.addEventListener('mouseup', stopMoving);
    document.body.addEventListener('blur', stopMoving);
    document.body.addEventListener('keydown', event => {
      if (!dragging) return;
      event.preventDefault();
      if (event.keyCode == 32) {
        rotateObject(dom, 90);
        belleAction(event);
      } else {
        extra_key = event.keyCode;
      }
    });
    document.body.addEventListener('keyup', event => {
      if (event.keyCode == 32) {
        rotateObject(dom, 0);
        no = false;
        if (dragging) event.preventDefault();
      } else if (event.keyCode == extra_key) {
        extra_key = 0;
      }
    });
    window.addEventListener('resize', event => setPos(prefX, prefY));
    window.addEventListener('mouseenter', initBelle);
    
    setInterval(() => all('.floater', me => {
      const t = parseInt(me.style.top) - 5;
      if (t <= 0) {
        me.parentNode.removeChild(me);
      } else {
        me.style.top = `${t}px`;
      }
    }), 50);
    
    return dom;
  })();
  const speechContainer = belle.querySelector('.speech_container');
  const optionsContainer = belle.querySelector('.options_container');
  const speech = belle.querySelector('.speech');
  const optionss = belle.querySelector('.options');
  
  const hitDetector = ((w, h) => {
    const canvas = newEl(`<canvas id="belle_mask" width="${w}" height="${h}">`).getContext('2d');
    const img = new Image();
    img.addEventListener('load', () => {
      canvas.clearRect(0, 0, w, h);
      canvas.drawImage(img, 0, 0); 
    });
    return {
      isHit: event => canvas.getImageData(event.clientX - parseInt(belle.style.left), event.clientY - parseInt(belle.style.top), 1, 1).data[3] > 0,
      render: _ => {
        img.src = URL.createObjectURL(new Blob([belle.querySelector('svg').outerHTML], {type: 'image/svg+xml'}));
      }
    };
  })(131, 384);
  
  initBelle();
  
  function initBelle() {
    setupImg(settingsMan.int('sweetie_img_index', 0));
    
    const x = settingsMan.has("sweetie_posX") ? settingsMan.float("sweetie_posX") : getMaxX();
    const y = settingsMan.has("sweetie_posY") ? settingsMan.float("sweetie_posY") : getMaxY();
    setPos(x, y, true);
  }
  
  function setupImg(i) {
    selected_image_index = i;
    all('#belle svg g[id]', a => a.setAttribute('display', 'none'));
    all(imgs[i < 0 ? 0 : i >= imgs.length ? imgs.length - 1 : i], a => a.setAttribute('display', 'inline'));
    hitDetector.render();
  }
  
  function belleAction(event) {
    if (extra_key == 81) {
      help();
    } else if (extra_key == 67) {
      cookieClicker();
    } else if (extra_key == 72) {
      toggleHearts();
    } else if (!no) {
      no = true;
      if (!grabber.grabbed()) {
        const img = getTargettedElement();
        if (img && img.tagName === "IMG") {
          if (event.shiftKey) {
            img.classList.toggle('wobbly_image');
          } else {
            grabber.grab(img);
          }
        } else {
          doImg();
        }
      } else {
        grabber.drop();
      }
    }
  }
  
  function getTargettedElement() {
    const oldX = belle.style.left;
    belle.style.left = "-1000px";
    const img = document.elementFromPoint(lastClientX , lastClientY);
    belle.style.left = oldX;
    return img;
  }

  function doImg() {
    if (Math.floor(Math.random() * 100) > 85) {
      const oldIndex = selected_image_index;
      let index = oldIndex;
      while (index == oldIndex) index = Math.floor(Math.random() * imgs.length);
      setupImg(index);
      updateSelection(index);
      settingsMan.set('sweetie_img_index', index, 0);
    }
  }
  
  function plusOne(x, y, text, func) {
    if (typeof(text) == 'number') {
      if (text == 0) return;
      text = (text > 0 ? '+' : '') + text;
    }

    document.body.insertAdjacentHTML('beforeend', `<span class="floater" style="position:absolute;transition:opacity 3s linear;opacity:1">${text}</span>`);
    const one = document.body.lastChild;
    one.style.top = `${y - one.offsetHeight/2}px`;
    one.style.left = `${x - one.offsetWidth/2}px`;
    setTimeout(() => {
      one.style.opacity = 0;
      setTimeout(() => {
        if (one.parentNode) one.parentNode.removeChild(one);
      }, 3000);
    }, 10);

    const floaters = document.querySelectorAll('.floater');
    for (let i = 31; i < floaters.length; i++) {
      floaters[i].parentNode.removeChild(floaters[i]);
    }
    
    if (func) func(one);
  }
  
  function help() {
    const pop = makePopup(jule('wSeeit ecSpeet reSrcte snIedx'), 'fa fa-child', false);
    pop.SetWidth(700);
    pop.SetContent(`<table class="properties">
            <tr>
                <td class="label">${jule(helpContent).replace(/-/g, '</td></tr><tr><td class="label">').replace(/;/g, '</td><td>')}</td>
            </tr>
        </table>`);
    pop.SetFooter(`<button class="styled_button" type="button" id="belle_type" >Switch Scepter ( <span>${selected_image_index + 1}</span>/${imgs.length} )</button><span></span>`);
    pop.Show();
    pop.content.querySelector('#belle_type').addEventListener('click', () => {
      const index = (selected_image_index + 1) % imgs.length;
      setupImg(index);
      settingsMan.set('sweetie_img_index', index, 0);
      updateSelection(index);
    });
  }

  function updateSelection(index) {
    const me = document.querySelector('#belle_type');
    if (!me) return;
    me.querySelector('span').innerText = index + 1;
    me.nextSibling.innerHTML = `<span style="transition:opacity 0.5s linear">${imgLabels[index]}</span>`;
    let t = setTimeout(() => {
      me.nextSibling.firstChild.style.opacity = 0;
      t = null;
    }, 250);
    const cancel = () => {
      if (t) clearTimeout(t);
      me.removeEventListener('mousedown', cancel);
    };
    me.addEventListener('mousedown', cancel);
  }
  
  function say(text, duration, fadeOptions) {
    if (speech.timeoutFunction) {
      clearInterval(speech.timeoutFunction);
    }
    speechContainer.style.display = 'block';
    speechContainer.style.opacity = text == '' ? 0 : 1;
    speech.innerHTML = text;

    if (duration) speech.timeoutFunction = setTimeout(() => {
      all(belle, '.speech_container, .options_container', a => a.style.opacity = 0);
      if (fadeOptions) speech.timeoutFunction = '';
      setTimeout(() => all(belle, '.speech_container, .options_container', a => a.style.display = ''), 2000);
    }, duration);
  }

  function options(factory) {
    optionss.innerHTML = '';
    factory(optionss);
    optionsContainer.style.opacity = optionss.children.length ? 1 : 0;
    optionsContainer.style.display = 'block';
    if (!optionss.children.length) {
      setTimeout(() => optionsContainer.style.display = '', 2000);
    }
  }
  
  function setPos(x, y, force) {
    prefX = x;
    prefY = y;
    
    if (!force) {
      x = clamp(x, 0, getMaxX());
      y = clamp(y, 0, getMaxY());
    }
    belle.style.left = `${x}px`;
    belle.style.top = `${y}px`;
    
    settingsMan.set("sweetie_posY", y);
    settingsMan.set("sweetie_posX", x);
  }

  function rotateObject(obj, deg) {
    deg = deg % 360;
    obj.style.transform = deg == 0 ? '' : `rotate(${deg}deg)`;
  }
  
  function svg() {
    return `
<svg width="131" height="384" version="1.1" viewBox="0 0 252.71896 755.80217" xmlns="http://www.w3.org/2000/svg">
	<g id="sc_back" transform="translate(12.759 20.073)" display="none">
		<g display="inline">
			<path d="m43.79 144.71c-14.062-7.3828-26.966-19.18-33.954-33.69 2.4356 1.1625 5.1738 2.3308 7.5869 2.8695-12.119-14.762-21.057-33.911-21.914-60.586 17.162 11.729 36.595 21.346 55.667 15.325" display="inline" fill="#cba20d" fill-rule="evenodd"/>
			<path d="m11.446 113.07c2.0745 4.296 13.911 16.432 24.961 18.867" display="inline" fill="none" stroke="#7a5e00" stroke-width="1.125"/>
			<path d="m43.79 144.71c-14.062-7.3828-26.966-19.18-33.954-33.69 2.4356 1.1625 5.1738 2.3308 7.5869 2.8695-12.119-14.762-21.057-33.911-21.914-60.586 17.162 11.729 36.595 21.346 55.667 15.325" display="inline" fill="none" stroke="#7a5e00" stroke-width="2.8125"/>
		</g>
	</g>
	<g id="aj_back" transform="translate(12.759 20.073)" display="none">
		<g transform="translate(-207.55 115.87)" display="inline">
			<path d="m238.53-109.79c-24.041-1.0999-29.169 8.1296-35.524 19.204-10.798 18.818-9.0072 36.57 2.7331 49.482" display="inline" fill="#e8c043"/>
			<path d="m198.05-79.874c-1.2266 13.108 3.2928 26.114 7.3661 29.799v8.538c-11.69-14.733-11.224-20.761-7.3661-38.337z" display="inline" fill="#cca213"/>
			<path d="m238.53-109.79c-24.041-1.0999-29.169 8.1296-35.524 19.204-10.798 18.818-9.0072 36.57 2.7331 49.482" display="inline" fill="none" stroke="#7a5e00" stroke-width="2.1562"/>
			<path d="m310.71-127.92c-4.903 19.976-31.045 20.598-27.121-6.3616-78.553 26.998-95.253 93.848-61.607 139.62l95.089-102.79c6.6492-5.5002 5.7076-15.28-6.3616-30.469z" display="inline" fill="#e8c043"/>
			<path d="m320.98-107.84c-2.7819-8.8899-7.8129-14.649-10.95-17.934" display="inline" fill="none" stroke="#f2d776" stroke-width="1.9687"/>
			<path d="m282.04-132.5c-1.3255 7.4526-0.11951 12.777 2.6074 16.113 2.7269 3.3365 6.8608 4.4725 10.811 3.9258l-0.35156-1.3944c-3.2257 0.44652-6.3387-1.6334-8.4375-4.2014-2.0988-2.5679-3.8832-6.9106-2.6427-13.886z" color="#000000" display="inline" fill="#f2d776" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			<path d="m206.82-54.2c-1.9525 24.275 13.072 47.94 19.185 56.19l-3.8751 2.5455c-10.089-13.113-20.163-36.223-15.31-58.736z" display="inline" fill="#cca213"/>
			<path d="m310.71-127.92c-4.903 19.976-31.045 20.598-27.121-6.3616-78.553 26.998-95.253 93.848-61.607 139.62l95.089-102.79c6.6492-5.5002 5.7076-15.28-6.3616-30.469z" display="inline" fill="none" stroke="#7a5e00" stroke-width="2.25"/>
		</g>
	</g>
	<g id="ts_back" transform="translate(12.759 20.073)" display="none">
		<path d="m30.32 199.06c22.513 11.853 80.835 42.989 103.05 55.389 2.1985-9.7032 10.561-56.317-4.8549-90.402-25.026-55.333-61.109-79.337-91.002-96.698" display="inline" fill="#b58f2e" stroke="#7a5e00" stroke-width="1.9687"/>
	</g>
	<g id="scepter_base" transform="translate(12.759 20.073)">
		<g transform="translate(-225.14 -151.56)">
			<g>
				<path d="m341.33 352.52 76.86 450.65-21.174 3.3107-76.86-450.65" fill="#e8c043"/>
				<path d="m323.82 356.31 76.943 446.02-4.1997 0.51318-75.638-445.58" fill="#cca213"/>
				<path d="m333.44 354.19 76.451 446.54 7.955-1.1996-76.393-446.93z" fill="#f2d776"/>
			</g>
			<path d="m341.33 352.52 76.86 450.65-21.174 3.3107-76.86-450.65" fill="none" stroke="#7a5e00" stroke-width="1.9"/>
		</g>
		<g transform="translate(-225.14 -151.56)">
			<g>
				<path d="m310.66 340.46 1.3012 18.508c12.381-3.7729 25.833-5.4219 38.75-6.6071l-4.8214-18.036" fill="#e8c043"/>
				<path d="m333.06 335.82 2.9552 18.178 9.0914-1.389-4.9245-17.804z" fill="#f2d776"/>
				<path d="m319.61 338.37 2.9578 17.622-10.378 2.9379-1.5227-18.467" fill="#cca213"/>
			</g>
			<path d="m310.66 340.46 1.3012 18.508c12.381-3.7729 25.833-5.4219 38.75-6.6071l-4.8214-18.036" fill="none" stroke="#7a5e00" stroke-width="1.9"/>
		</g>
		<g transform="translate(-225.14 -151.56)">
			<g>
				<path d="m350 321.83 5.3572 10.893c-21.111 2.5469-35.55 5.2542-52.101 9.081l-0.72957-18.729" fill="#e8c043"/>
				<path d="m339.3 324.57-6.9448 1.6415 1.7678 9.2176 8.5863-1.1364z" fill="#f2d776"/>
				<path d="m314.57 325.64 1.7022 13.513-14.353 3.349 1.6486-19.316" fill="#cca213"/>
			</g>
			<path d="m350 321.83 5.3572 10.893c-21.111 2.5469-35.55 5.2542-52.101 9.081l-0.72957-18.729" fill="none" stroke="#7a5e00" stroke-width="1.9"/>
		</g>
		<g transform="translate(-225.14 -151.56)">
			<path d="m302.53 323.07c14.553 4.7097 30.337 5.5747 45.496-0.72975 27.295-11.351 44.049-56.585 10.548-99.623-38.785-49.826-108.02-17.106-104.77 36.042 2.8638 46.794 48.316 64.178 48.726 64.311z" fill="#e8c043"/>
			<path d="m368.98 302.73c-17.314 27.575-47.537 28.706-67.423 20.608-30.426-12.39-47.375-41.431-47.822-68.428 1.0048 3.0515 6.4898 0.80949 6.8105 3.9939 5.0489 50.142 83.871 81.751 108.43 43.827z" fill="#cca213"/>
			<path d="m302.53 323.07c14.553 4.7097 30.337 5.5747 45.496-0.72975 27.295-11.351 44.049-56.585 10.548-99.623-38.785-49.826-108.02-17.106-104.77 36.042 2.8638 46.794 48.316 64.178 48.726 64.311z" fill="none" stroke="#7a5e00" stroke-width="2.2997"/>
		</g>
		<g transform="translate(-225.14 -151.56)">
			<g>
				<ellipse transform="matrix(1.274 0 .084071 1.3186 1.9894 -136.34)" cx="219.64" cy="307.72" rx="19.554" ry="20.179" fill="#f5edaf"/>
				<path d="m312.5 243.52c-16.546 2.6899-24.894 14.175-22.321 27.589 2.688 14.013 13.847 22.525 25.893 20.179 12.462-2.427 17.683-7.5944 16.875-24.821-0.46188-9.8454-10.718-24.528-20.446-22.946z" fill="#e7bf38"/>
				<path d="m306.96 250.76c-6.4426 2.9101-11.099 8.8952-8.0357 21.518 3.7076 15.276 17.498 17.173 26.696 12.321 12.022-6.3405 7.6196-20.42 3.9286-26.607-3.7167-6.2303-15.978-10.219-22.589-7.2321z" fill="#b39117"/>
				<ellipse transform="matrix(1.4632 .58023 -.51792 1.2892 149.78 -252.22)" cx="213.66" cy="302.72" rx="5.8929" ry="9.8214" fill="#f5edaf"/>
				<ellipse transform="matrix(1.0747 -.16437 -.064181 1.109 90.677 -33.675)" cx="233.39" cy="312.23" rx="3.0357" ry="4.0625" fill="#f5edaf"/>
			</g>
			<path d="m299.15 243.26c-11.006 2.9244-19.115 17.253-15.91 31.315 2.8099 12.328 16.79 24.175 31.188 20.961 15.506-3.4619 21.177-18.595 18.562-30.052-3.0295-13.272-15.535-27.087-33.84-22.223z" fill="none" stroke="#7a5e00" stroke-width="1.875"/>
		</g>
		<g transform="translate(-225.14 -151.56)">
			<g>
				<path d="m355.85 274.91c6.1672 1.1277 10.274-1.7187 13.482-3.7946-4.8617 6.5907-7.6359 5.764-13.482 3.7946z" fill="#f5edaf"/>
				<path d="m342.86 270.25c5.0853 7.4514 19.81 8.7958 21.344 14.594 1.3506 5.1056-1.6266 11.355-5.0938 15.594 5.6626-3.2876 9.9145-11.278 8.6562-16.5-3.2668-13.559-26.167-0.45843-28.795-33.277-2.5115 7.5669 2.3056 17.27 3.8884 19.589z" color="#000000" fill="#f2d776" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
				<path d="m347.59 237.54c-7.8409 2.0878-12.01 11.715-7.5893 22.946 4.6426 11.797 13.079 13.636 19.286 11.875 7.1191-2.0202 8.156-12.123 5.2679-21.25-2.1074-6.6602-10.214-15.369-16.964-13.571z" fill="#b39117"/>
				<ellipse transform="matrix(1.1556 -.13658 -.14373 1.4529 87.636 -137.46)" cx="260.58" cy="290.22" rx="6.1161" ry="6.875" fill="#f5edaf"/>
				<ellipse transform="matrix(.88725 -.53016 .34861 .67283 42.112 175.44)" cx="233.39" cy="312.23" rx="3.0357" ry="4.0625" fill="#f5edaf"/>
			</g>
			<g fill="none" stroke="#7a5e00">
				<path d="m351.7 311.2 0.53572-10.179" stroke-width="1.4"/>
				<path d="m343.48 312.99 3.9286-12.411" stroke-width="1.6"/>
				<path d="m341.07 298.17-5.0893 8.8393" stroke-width="1.7"/>
				<path d="m358.18 299.93c-2.413 19.341-26.525 19.427-25.949-8.2648 11.575 10.948 20.006 9.3529 25.945 8.3266 7.3632-1.2725 11.595-12.364 9.8643-17.323-3.5922-10.294-21.342-3.0262-27.345-21.19-5.8524-17.708-1.5723-26.782 7.2673-29.444 5.5932-1.6848 16.41 2.2032 20.944 14.087 10.588 27.751-7.2063 30.75-7.2063 30.75" stroke-width="1.875"/>
			</g>
			<path d="m346.7 283.53c-1.1605 6.9404 5.7125 8.2894 8.192 3.125-3.5689 2.3324-7.3413 1.7011-8.192-3.125z" color="#000000" fill="#7a5e00" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
		</g>
	</g>
	<g id="eyes_mare" transform="translate(12.759 20.073)" fill="#7a5e00">
		<g id="eyes_mare_bottom">
			<g transform="translate(-7.2518e-8 3.0025e-6)">
				<path d="m75.047 141.58-2.2977-0.9122c0.02772 2.3427-1.9777 5.2589-4.1608 6.7698 4.1722-0.46067 6.8394-3.7009 6.4585-5.8576z" color="#000000" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
				<path d="m78.754 143c0.47446 2.4146-0.42941 5.1455-2.127 7.2 3.5557-1.508 4.6532-4.4031 4.3795-6.3743z" color="#000000" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
				<path d="m85.736 143.84c-0.06275 2.8641-0.3786 5.5098-2.0998 8.5274 4.3669-3.1913 4.7812-6.5942 4.8587-9.1263z" color="#000000" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			</g>
			<g transform="translate(-7.2518e-8 3.0025e-6)">
				<path d="m147.3 108.93-0.42706 2.6381c2.2061 0.92796 5.3913 1.6885 8.0338-1.5114-2.513 0.30166-5.8922 0.78326-7.6068-1.1267z" color="#000000" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
				<path d="m146.62 115.9-1.519 1.426c2.5581 2.1101 6.4282 2.4309 8.9966 0.5016-2.3348-0.0697-5.9357-0.337-7.4777-1.9276z" color="#000000" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
				<path d="m143.44 120.53-2.8088 2.3825c2.5641 0.98206 5.962 3.3154 11.834 1.9308-4.061-1.1694-6.1862-2.1137-9.0253-4.3133z" color="#000000" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			</g>
		</g>
		<path d="m47.262 80.065c1.3654 8.3049 11.166 14.036 18.077 16.496l1.6427-1.9944c-5.7543-1.8266-16.765-9.7443-19.72-14.502z" color="#000000" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
		<path d="m45.132 89.888c1.9924 4.8705 10.068 10.497 17.293 11.758l0.87815-3.5029c-8.4603-0.9707-15.144-6.0571-18.171-8.2546z" color="#000000" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
		<path d="m40.008 101.24c6.0389 4.5314 12.676 5.4797 19.658 4.7783l0.33033-2.5626c-7.8265 1.4698-15.879-0.37336-19.988-2.2157z" color="#000000" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
		<path d="m141.58 63.542c-2.4803 8.9098-4.532 13.592-8.3018 17.962l2.0814 1.5512c1.828-3.3565 5.0381-6.3386 6.2204-19.513z" color="#000000" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
		<path d="m147.19 73.779c-2.3443 4.7644-5.7185 8.8735-8.7841 11.398l1.7998 2.3021c2.429-3.2457 4.4288-5.3672 6.9842-13.7z" color="#000000" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
		<path d="m152.14 81.706c-2.5823 4.5284-7.2755 7.7366-9.9893 9.3066l0.86798 1.581c2.1712-1.4829 7.4571-5.3935 9.1213-10.888z" color="#000000" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
	</g>
	<g id="eyes_filly" transform="translate(12.759 20.073)" display="none" fill="#7a5e00">
		<g transform="translate(-225.14 -151.56)" display="inline">
			<path d="m280.63 235.46c-0.96479 5.4931 3.4827 11.626 9.5867 13.443l2.1085-2.3171c-6.8007-2.1803-10.629-8.046-11.695-11.126z" color="#000000" display="inline" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			<path d="m277.03 243.03c-0.74854 5.7942 3.2076 10.651 10.104 10.047l1.2151-2.6102c-4.6467 0.0471-8.7317-1.2794-11.319-7.4364z" color="#000000" display="inline" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			<path d="m274.77 251.06c-0.0287 3.5061 2.8449 8.4244 9.4512 7.3159l0.68353-2.0879c-3.7568 0.0166-7.2075-0.74137-10.135-5.228z" color="#000000" display="inline" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
		</g>
		<g transform="translate(-225.14 -151.56)" display="inline">
			<path d="m362.97 223.15c-0.17894 4.6962-2.1813 8.3633-4.553 9.9117l2.0982 1.5638c1.7089-1.6872 4.3879-3.9535 2.4548-11.475z" color="#000000" display="inline" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			<path d="m370.38 228.09c-1.6044 3.9102-3.622 7.6953-6.5784 9.4363l1.8144 2.3208c2.538-2.647 5.045-5.857 4.764-11.757z" color="#000000" display="inline" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			<path d="m374.26 237.37c-1.8889 3.1811-3.9415 4.451-6.6772 6.0338l1.1429 1.9509c2.6352-1.4056 4.8836-3.7854 5.5344-7.9847z" color="#000000" display="inline" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
		</g>
	</g>
	<g id="sb" transform="translate(-212.38 -131.48)" display="none">
		<g transform="translate(225.14 151.56)">
			<g transform="translate(-225.14 -151.56)">
				<g>
					<path d="m235.27 241.73c-8.7194 36.039-4.2768 52.338 15.684 82.858-14.757 33.727 30.623 59.186 47.927 28.887 20.593-36.058-16.45-57.282-35.314-62.324-5.7828-41.342-19.484-43.134-28.297-49.422z" display="inline" fill="#e8c043"/>
					<path d="m302.67 347.7c-14.649 38.914-74.523 10.923-51.418-23.735-12.821-14.4-16.163-22.632-20.179-41.25 13.962 35.527 58.103 15.589 71.597 64.985z" display="inline" fill="#cba20d"/>
					<path d="m265.22 291.67-0.875 1.6741c9.1137 2.9983 29.973 8.6491 38.562 39.125l1.7054-1.2857c-2.8103-9.9706-5.8156-18.096-10.359-23.54-9.8332-11.781-22.926-13.964-29.033-15.974z" color="#000000" display="inline" fill="#f2d776" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
					<path d="m263.56 291.16-4.3882 1.9643s32.52-0.21469 41.826 28.567c5.1211 15.84-1.5076 34.377-12.75 40.844-15.667 9.0121-37.604-1.2653-39.688-20.375-1.3587-12.461 2.352-19.017 13.969-21.344 7.8567-1.5734 14.52 3.4987 15.658 10.339 0.79396 4.7726-1.6546 10.665-6.5352 11.143-6.2878 0.61669-9.0502-3.3966-6.5912-9.2872-5.8617 5.3156-0.63498 12.232 6.3439 11.399 6.9766-0.83214 9.8534-7.6219 9.0312-13.094-1.4536-9.6743-10.377-14.61-18.406-12.844-13.933 3.0642-17.268 11.288-15.844 24 2.3922 21.344 26.226 32.144 43.281 22.125 14.871-8.7354 18.502-28.679 13.812-43.688-5.1611-16.518-21.296-29.09-39.719-29.75z" color="#000000" display="inline" fill="#7a5e00" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
				</g>
				<path d="m251.53 324.04c-15.585-16.26-28.253-44.614-16.31-82.152" fill="none" stroke="#7a5e00" stroke-width="2.1"/>
			</g>
			<g transform="translate(-225.14 -151.56)">
				<g>
					<path d="m342.1 154.23c-11.804-0.28442-25.386 0.85619-31.559 1.3353 17.35 16.252 29.014 45.194 37.062 61.409 12.046-5.8375 22.532-28.392 28.588-31.387 18.232-16.647-17.956-30.969-34.092-31.358z" display="inline" fill="#e8c043"/>
					<path d="m310.31 226.3c-21.705 11.833-41.162 6.2152-43.533-15.185l-17.922-16.002c17.975-20.571 35.47-32.339 61.686-39.555 6.9112 0.62412 35.708 19.878 37.062 61.409l-21.849-22.699z" display="inline" fill="#cba20d"/>
					<path d="m316.71 155.08c18.8 0.70752 57.231 5.5356 62.225 25.636 12.064-18.396-51.848-37.128-62.225-25.636z" color="#000000" display="inline" fill="#f2d776" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
				</g>
				<path d="m374.02 186.92c35.206-20.665-65.129-68.255-125.49 7.9898" display="inline" fill="none" stroke="#7a5e00" stroke-width="2.8125"/>
				<path d="m268.89 218.65c4.507 24.881 51.936 15.841 47.764-8.5386" fill="none" stroke="#7a5e00" stroke-width="2.8125"/>
			</g>
			<g transform="translate(-225.14 -151.56)">
				<path d="m263.87 264.97c-39.987-23.122-43.302-47.787-31.911-75.82 21.438 3.4613 37.053 19.334 39.83 41.205" display="inline" fill="#e8c043" fill-rule="evenodd"/>
				<path d="m227.81 201.21c1.1884 24.079 11.765 40.963 36.068 63.759-26.497-15.867-41.891-38.121-36.068-63.759z" display="inline" fill="#cca213"/>
				<path d="m238.42 205.02c-4.1537 15.107 3.5497 29.157 15.964 32.263-11.565-6.6501-16.786-18.292-15.964-32.263z" color="#000000" display="inline" fill="#7a5e00" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
				<path d="m231.27 187.66c-14.599 39.029-2.8508 57.139 32.607 77.312-1.9716-1.4912-2.9378-3.4073-4.8031-4.7163-33.309-23.377-35.199-39.662-26.367-69.627 20.059 4.0121 35.429 18.225 39.089 39.728 0.72262-26.025-20.998-39.784-40.527-42.696z" color="#000000" display="inline" fill="#7a5e00" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			</g>
			<g transform="translate(-225.14 -151.56)">
				<path d="m250.25 269.18s-7.8129-16.336 9.115-16.218c16.928 0.11837 22.476 34.809-2.1435 38.976" fill="#e8c043" fill-rule="evenodd"/>
				<path d="m253.73 254.91c9.2126-1.0579 18.947 6.6882 19.644 21.434 7.6255-4.2089-8.954-28.373-19.644-21.434z" color="#000000" display="inline" fill="#f2d776" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
				<path d="m246.22 262.81c-0.0373 6.3271 4.1126 9.6624 7.875 10.281 5.7317 0.94284 8.0159-5.3094 2.6129-6.9789 2.8828 2.6838 0.40725 5.0518-2.3004 4.6976-2.698-0.35284-5.8615-2.6381-5.9062-8.0312-0.0383-4.6182 3.9522-9.1087 11-8.3125 9.2068 1.0401 14.951 11.955 13.875 20.438-1.5103 11.901-16.289 20.957-25.323 12.675 9.3834 13.353 26.259 0.36533 27.605-12.394 1.0995-10.429-4.8375-21.997-15.938-23-8.8804-0.80282-13.467 5.035-13.5 10.625z" color="#000000" display="inline" fill="#7a5e00" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			</g>
			<g transform="translate(-225.14 -151.56)">
				<path d="m347.6 216.97c25.824 22.955 53.697 3.2011 50.877-14.513-3.0171-18.953-37.021-20.748-33.692-4.5593" display="inline" fill="#e8c043" fill-rule="evenodd"/>
				<path d="m375.88 187.97c11.883 2.327 20.079 10.229 19.906 22.75 7.3603-17.972-14.789-26.007-19.906-22.75z" color="#000000" display="inline" fill="#f2d776" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
				<path d="m363.88 193.66c-2.5919 7.6186-0.75304 15.937 5.4062 19.688 9.633 5.8651 19.665-3.7937 15.478-11.223-3.504-6.2178-13.433-2.8659-9.7277 2.9821 0.58794-5.6763 5.5174-4.7339 7.0364-1.5334 2.911 6.1336-6.0335 10.535-10.818 7.3994-5.4462-3.569-6.775-10.165-4.4062-16.344 5.4652-14.255 33.052-2.3841 29.625 13.219-3.5345 16.091-22.939 21.694-39.562 13.281-14.785-7.4826-19.954-16.156-25.354-27.741-0.80441 13.778 14.677 25.962 23.979 30.491 21.452 10.445 40.094 1.4209 43.969-15.375 4.785-20.742-29.789-31.999-35.625-14.844z" color="#000000" display="inline" fill="#7a5e00" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			</g>
			<g transform="translate(-225.14 -151.56)">
				<g>
					<path d="m317.83 193.8 17.319 16.769s20.684-36.859 13.317-41.295c-7.3661-4.4364-30.636 24.526-30.636 24.526z" display="inline" fill="#e8c043" fill-rule="evenodd"/>
					<path d="m346.52 168.34c5.025 10.81-11.478 26.542-11.37 42.221 5.9688-11.018 20.098-39.968 11.37-42.221z" display="inline" fill="#cca213"/>
					<path d="m343.49 168.81c-8.944 7.0476-16.225 11.381-23.755 23.561l4.326 5.8163c4.8594-9.9376 14.222-21.14 19.429-29.378z" color="#000000" display="inline" fill="#eecf65" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
				</g>
				<path d="m328.7 181.24c-0.17562 8.3179 2.4235 17.358 10.857 19.518" fill="none" stroke="#7a5e00" stroke-width="1.7"/>
				<path d="m338.63 170.58c1.4943 7.5685 1.7829 11.732 8.1149 16.717" fill="none" stroke="#7a5e00" stroke-width="1.6"/>
				<path d="m341.16 168.64c-10.57 5.162-28.053 28.609-30.15 35.602 7.373-8.1767 21.68-29.636 31.526-34.214 6.7141-3.1221 6.6452 3.4985 5.4195 8.5526-2.851 11.756-11.486 24.576-12.969 32.455 6.0673-9.9068 12.31-21.411 15.049-32.195 2.2606-8.9004-0.85529-14.118-8.876-10.201z" color="#000000" display="inline" fill="#7a5e00" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			</g>
			<g transform="translate(-225.14 -151.56)">
				<path d="m305.28 186.46c13.505 0.80293 22.663 10.187 21.504 24.501-1.1719 14.481-19.695 19.366-29.548 9.1239-5.8264-6.0566-4.1623-19.549 3.5156-21.345" fill="#cba20d" fill-rule="evenodd"/>
				<path d="m305.28 186.46c18.969 3.9241 23.053 18.106 18.844 29.888-3.7894 10.608-25.761 11.15-28.781-2.8125-3.648-16.864 14.403-16.871 17.531-9.3125 1.6306 3.9402-1.0682 9.9688-5.5 8.25-2.8437-1.1029-3.4382-5.1879-1.5758-7.2411-4.8059 2.1953-2.3763 8.7668 1.5982 9.6161 6.841 1.4618 10.057-6.5358 7.7178-11.88-4.702-10.74-26.495-8.1752-22.429 11.099 3.3697 15.975 28.241 17.182 33.853 3.3651 6.656-16.386-5.2197-32.616-21.258-30.972z" color="#000000" display="inline" fill="#7a5e00" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			</g>
			<g transform="translate(-225.14 -151.56)" display="inline">
				<path d="m446.43 880.01 18.259-29.906-94.702 13.89 31.315 23.36c15.208-1.5288 30.157-4.3835 45.128-7.343z" display="inline" fill="#9c6cae"/>
				<path d="m395.11 820.05-25.381 43.736c16.143 0.18274 95.784-10.368 94.955-13.684l-38.437-34.709z" display="inline" fill="#b28dc0"/>
				<path d="m446.38 854.78-28.663-40.785-7.1973 1.894 11.364 43.184-0.12627 26.011 17.516-3.7289z" display="inline" fill="#fff" fill-opacity=".26"/>
				<path d="m425.3 858.54-32.08 3.6855 12.122 24.496 19.193-2.5254z" display="inline" fill="#7a8fb5"/>
				<path d="m392.97 862.1 10.48-46.72 7.584-1.4126 14.268 44.573z" display="inline" fill="#8d9fc0"/>
				<path d="m394.64 820.67-24.911 43.125 31.339 23.304c15.739-1.0909 31.284-3.6106 45.357-7.0816l18.617-30.105-38.796-34.51" fill="none" stroke="#795b8a" stroke-width="1.4"/>
				<path d="m369.73 863.79c26.985-0.30075 77.288-7.2829 95.314-13.883" fill="none" stroke="#795b8a" stroke-width="1.4"/>
			</g>
		</g>
	</g>
	<g id="ab" transform="translate(12.759 20.073)" display="none">
		<g transform="translate(-225.14 -151.56)">
			<path d="m446.43 880.01 18.259-29.906-94.702 13.89 31.315 23.36c15.208-1.5288 30.157-4.3835 45.128-7.343z" display="inline" fill="#f62a4b"/>
			<path d="m395.11 820.05-25.381 43.736c16.143 0.18274 95.784-10.368 94.955-13.684l-38.437-34.709z" display="inline" fill="#f74260"/>
			<path d="m446.38 854.78-28.663-40.785-7.1973 1.894 11.364 43.184-0.12627 26.011 17.516-3.7289z" display="inline" fill="#fff" fill-opacity=".26"/>
			<path d="m425.3 858.54-32.08 3.6855 12.122 24.496 19.193-2.5254z" display="inline" fill="#f63a59"/>
			<path d="m392.97 862.1 10.48-46.72 7.584-1.4126 14.268 44.573z" display="inline" fill="#f74c68"/>
			<path d="m394.64 820.67-24.911 43.125 31.339 23.304c15.739-1.0909 31.284-3.6106 45.357-7.0816l18.617-30.105-38.796-34.51" fill="none" stroke="#c42551" stroke-width="1.4"/>
			<path d="m369.73 863.79c26.985-0.30075 77.288-7.2829 95.314-13.883" fill="none" stroke="#c42551" stroke-width="1.4"/>
		</g>
		<g transform="translate(0 -316.11)" display="inline">
			<path d="m145.9 692.36c-8.2575 12.007-18.192 6.1918-21.827 2.5371l2.6038 12.743-33.144-8.4907-27.163-10.749-23.479-18.118-12.707-25.697-9.761 23.272-4.3265 25.519 2.6911 21.905 7.4052 5.4513 22.176 8.8499 29.931 1.2689 49.368-18.363 2.2373 10.95c5.5925 0.69508 6.7929-1.4569 10.315-1.5413 4.0334-0.0966 10.055 1.7398 11.171 0.38119l-2.4407-12.243 25.958 5.4003 38.068 4.1823 30.351-2.0418 20.364-4.0272-4.2938-32.812-7.463-29.683-10.606-21.657-13.068 18.357-27.92 24.468-52.109 33.651z" display="inline" fill="#f46192"/>
			<g fill="#ec4c81">
				<path d="m31.435 642.64 32.325 9.5964 27.779 16.162 26.769 22.223 8.0812 10.102 0.50507 5.5558-31.82-6.566-38.891-17.173-20.708-23.234z" display="inline"/>
				<path d="m148.61 701.48 27.779-36.365 30.305-30.052 20.961-10.102 12.122 3.283-7.5762 14.395-16.415 18.435-23.991 17.678-27.274 17.173-13.89 7.5761z" display="inline"/>
				<path d="m145.96 693.4-12.374 6.8185 13.511 0.25253z" display="inline"/>
				<path d="m128.03 715.63 1.6415 8.5863 10.228-2.2728z" display="inline"/>
			</g>
			<path d="m231.08 623.43c-3.3732-0.082-6.9644 0.73297-10.656 2.25-7.3838 3.034-15.398 8.883-23.75 16.562-16.101 14.805-33.47 36.52-49.182 58.585-0.58769 0.82537 0.96978 1.6736 0.38688 2.4996l0.54464 1.8839c16.092-22.803 34.122-45.503 50.5-60.562 8.189-7.5298 15.976-13.123 22.75-15.906 6.7269-2.7642 12.219-2.8092 16.688 0.375 1.9287 1.8041 4.6641 6.138 7.4062 12 2.7636 5.9076 5.6158 13.373 8.125 21.531 4.92 15.996 8.4798 34.679 7.9375 49.625-3.4796 1.8873-9.6608 3.5752-17.562 4.6562-8.4655 1.1582-18.819 1.7239-29.875 1.5312-22.112-0.38525-47.075-3.7471-65.438-10.812l-0.22768 2.0804c0.48855 0.18797 0.0214 1.3555 0.51808 1.5382 18.785 6.9119 43.262 10.095 65.085 10.475 11.2 0.19513 21.69-0.34297 30.375-1.5312s15.533-2.943 19.688-5.5312l0.71875-0.46875 0.0312-0.84375c0.75603-15.749-2.9966-35.115-8.0938-51.688-2.5486-8.2862-5.434-15.851-8.2812-21.938s-5.5806-10.667-8.25-13.125l-0.0625-0.0625-0.0625-0.0312c-2.7819-2.017-5.9392-3.0118-9.3125-3.0938z" color="#000000" display="inline" fill="#cd2d6a" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			<path d="m31.669 640.55-0.59375 0.6875c-5.7859 6.721-11.031 19.242-14.062 33.281s-3.7839 29.571 0.0937 42.125l0.125 0.4375 0.375 0.3125c15.566 12.847 49.609 27.57 110.32-3.7862 0.47534-0.24551-0.11911-0.98492 0.35951-1.2361l-0.42852-2.3214c-60.308 31.65-92.744 17.39-107.78 5.1875-3.4712-11.66-2.8512-26.538 0.0625-40.031 2.8475-13.186 7.9051-24.948 12.844-31.094 42.595 8.4776 72.464 34.084 92.969 58.953 0.5603-1.1895-0.43636-5.092-0.61129-5.6959-20.861-24.252-50.791-48.592-92.764-56.632z" color="#000000" display="inline" fill="#cd2d6a" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			<path d="m31.763 643.7c6e-3 20.819 24.961 51.104 95.431 63.792" display="inline" fill="none" stroke="#cd2d6a" stroke-width="3"/>
			<path d="m238.76 627.96c-5.3071 13.543-18.738 27.471-35.781 40.562-16.486 12.663-36.316 24.556-55.297 34.895-0.0362 1.0274-0.0578 0.9941 0.41782 2.2393 0.50151-0.27125-0.0231 0.7287 0.4798 0.45523 19.182-10.432 39.291-22.469 56.087-35.37 17.236-13.24 31.038-27.332 36.688-41.75z" color="#000000" display="inline" fill="#cd2d6a" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			<path d="m124.95 696.02c5.7434 5.0932 13.953 5.0326 22.5 4.2857l3.6607 22.143c-8.8643 0.73557-17.866-2.1051-22.768-6.9643z" fill="none" stroke="#cd2d6a" stroke-width="1.9"/>
			<path d="m128.28 715.48 1.4017 8.1296c4.2505 0.0565 8.0568-0.55262 11.283-1.7896m8.8958-7.1389-3.75-21.964c-2.3992 4.0184-8.4426 7.2297-16.635 6.0922" fill="none" stroke="#cd2d6a" stroke-width="1.9"/>
		</g>
		<g transform="translate(1.6741 -318.79)" display="inline">
			<g>
				<path d="m23.726 478.69c0.42205 38.098 16.746 63.34 35.09 68.044 9.0459 2.3195 23.152 1.8847 27.133-8.8543 7.1894-19.398-2.2927-25.883-16.639-38.585 4.5164-3.8382 6.5236-7.9344 3.413-12.577-13.684-20.425-40.619-26.36-41.052-64.582l-7.536-3.2802s-0.56316 45.857-0.4083 59.836z" display="inline" fill="#e8c043"/>
				<path d="m68.107 500.05c17.699 13.999 19.39 30.66 12.938 41.188 11.419-4.4922 9.0241-34.408-12.938-41.188z" color="#000000" display="inline" fill="#f2d776" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
				<path d="m23.951 456.37c1.5249 10.017 3.7887 94.993 55.727 87.869-42.353 19.864-60.182-49.958-55.727-87.869z" display="inline" fill="#cca213"/>
			</g>
			<g fill="none" stroke="#7a5e00">
				<path d="m62.03 498.09c30.342 4.663 38.193 51.951 1.921 49.525-19.616-1.312-37.154-27.999-39.676-59.933-0.87914-11.132 2.2753-45.345-1.0045-78.348" display="inline" stroke-width="2.8125"/>
				<path d="m24.155 482.06c8.3561 24.654 23.164 49.11 57.283 60.581" stroke-width="1.5"/>
				<path d="m24.571 470.97c12.862 32.092 36.525 53.57 62.423 51.967" stroke-width="1.6997"/>
			</g>
			<g>
				<path d="m32.138 418.99c-16.274 23.467 15.928 60.856 25.071 75.678 0 0 10.52 13.424 15.085-0.0206 7.2908-21.471-46.472-29.985-40.156-75.658z" fill="#e8c043" fill-rule="evenodd"/>
				<path d="m37.32 451.71c5.3527 10.476 15.355 18.075 22.287 24.812s12.285 12.923 12.688 18.125c5.5568-13.543-24.418-30.745-34.974-42.938z" color="#000000" display="inline" fill="#f2d776" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
				<path d="m68.301 482.64c4.3047 5.4877 4.7207 11.69 2.1077 13.957-4.304 3.7344-9.825 1.9513-13.199-1.9297 2.1246 7.8187 10.512 8.1919 15.137 3.9668 4.6188-4.2202 2.6402-13.674-3.3225-19.629-18.315-18.291-42.763-24.504-34.528-74.916-17.532 49.514 23.304 65.163 33.806 78.551z" color="#000000" color-rendering="auto" display="inline" dominant-baseline="auto" fill="#7a5e00" fill-rule="evenodd" image-rendering="auto" shape-rendering="auto" solid-color="#000000" style="font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;isolation:auto;mix-blend-mode:normal;shape-padding:0;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
			</g>
		</g>
		<path d="m121.99 44.986c5.5254-1.6666 14.255 6.8649 20.279 8.9289 2.3319 0.79903 5.7775-0.2826 5.1019-3.5055-3.4431-16.424-39.183-37.868-73.711-31.8-18.178 3.1943-37.811 13.058-48.33 37.368l16.307 19.66" display="inline" fill="#e8c043" fill-rule="evenodd"/>
		<path d="m85.857 18.568c19.28 1.4856 45.275 10.775 59.875 31.875 3.5233-13.928-37.116-36.877-59.875-31.875z" color="#000000" display="inline" fill="#f2d776" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
		<path d="m25.333 55.977c10.519-24.31 30.152-34.174 48.33-37.368 34.528-6.0675 69.567 12.456 73.01 28.879 0.67565 3.2229-0.55005 6.9918-4.4008 6.4265-6.3001-0.92494-14.753-10.596-20.279-8.9289" display="inline" fill="none" stroke="#7a5e00" stroke-width="2.8125"/>
		<g transform="translate(-2.8737e-8 -1.9279e-6)" display="inline">
			<path d="m119.02 42.081c9.949-0.32212 32.162 19.952 20.053 30.916-12.286 11.125-42.87-22.564-51.658-11.074" fill="#e8c043" fill-rule="evenodd"/>
			<path d="m128.65 46.505c3.0621 4.0297 6.1446 7.3402 7.6097 10.299 1.4652 2.9589 3.7526 7.9909 2.0625 14.139 10.201-2.7444-3.0554-23.122-9.6722-24.438z" color="#000000" display="inline" fill="#f2d776" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			<path d="m124.53 43.953c10.815 4.5367 22.543 19.957 13.595 28.002-11.298 10.158-41.869-23.873-51.832-10.887l2.2344 1.709c9.3452-9.2712 37.922 23.421 51.484 11.262 13.013-11.667-6.5164-30.808-15.481-30.086z" color="#000000" color-rendering="auto" display="inline" dominant-baseline="auto" fill="#7a5e00" fill-rule="evenodd" image-rendering="auto" shape-rendering="auto" solid-color="#000000" style="font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;isolation:auto;mix-blend-mode:normal;shape-padding:0;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
		</g>
		<path d="m33.437 41.835c24.344-15.114 72.317-5.2373 82.851 27.109" fill="none" stroke="#7a5e00" stroke-width="1.6997"/>
		<path d="m46.083 30.053c32.271-14.236 72.006 0.99646 95.459 37.173" fill="none" stroke="#7a5e00" stroke-width="1.6997"/>
		<g fill-rule="evenodd">
			<path d="m39.523 78.658c2.3982-11.391 45.922-2.9144 49.873-17.086 2.1986-7.8858-10.699-6.9337-10.699-6.9337" fill="#e8c043"/>
			<path d="m78.697 54.639c3.5612 0.0962 9.4629 0.76752 9.4414 5.0605-0.08172 16.336-50.918 4.4087-48.615 18.959 10.092-10.595 51.492-0.04803 51.428-18.936-0.0246-7.1949-8.8636-8.5957-12.254-5.084z" color="#000000" color-rendering="auto" display="inline" dominant-baseline="auto" fill="#7a5e00" image-rendering="auto" shape-rendering="auto" solid-color="#000000" style="font-feature-settings:normal;font-variant-alternates:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-variant-numeric:normal;font-variant-position:normal;isolation:auto;mix-blend-mode:normal;shape-padding:0;text-decoration-color:#000000;text-decoration-line:none;text-decoration-style:solid;text-indent:0;text-orientation:mixed;text-transform:none;white-space:normal"/>
		</g>
		<g transform="translate(-225.14 -151.56)" display="inline">
			<path d="m263.87 264.97c-39.987-23.122-43.302-47.787-31.911-75.82 21.438 3.4613 37.053 19.334 39.83 41.205" display="inline" fill="#e8c043" fill-rule="evenodd"/>
			<path d="m227.81 201.21c1.1884 24.079 11.765 40.963 36.068 63.759-26.497-15.867-41.891-38.121-36.068-63.759z" display="inline" fill="#cca213"/>
			<path d="m238.42 205.02c-4.1537 15.107 3.5497 29.157 15.964 32.263-11.565-6.6501-16.786-18.292-15.964-32.263z" color="#000000" display="inline" fill="#7a5e00" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			<path d="m231.27 187.66c-14.599 39.029-2.8508 57.139 32.607 77.312-1.9716-1.4912-2.9378-3.4073-4.8031-4.7163-33.309-23.377-35.199-39.662-26.367-69.627 20.059 4.0121 35.429 18.225 39.089 39.728 0.72262-26.025-20.998-39.784-40.527-42.696z" color="#000000" display="inline" fill="#7a5e00" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
		</g>
	</g>
	<g id="sc" transform="translate(12.759 20.073)" display="none">
		<g transform="translate(-225.14 -151.56)" display="inline">
			<path d="m446.43 880.01 18.259-29.906-94.702 13.89 31.315 23.36c15.208-1.5288 30.157-4.3835 45.128-7.343z" display="inline" fill="#cd378d"/>
			<path d="m395.11 820.05-25.381 43.736c16.143 0.18274 95.784-10.368 94.955-13.684l-38.437-34.709z" display="inline" fill="#d24b98"/>
			<path d="m446.38 854.78-28.663-40.785-7.1973 1.894 11.364 43.184-0.12627 26.011 17.516-3.7289z" display="inline" fill="#fff" fill-opacity=".26"/>
			<path d="m425.3 858.54-32.08 3.6855 12.122 24.496 19.193-2.5254z" display="inline" fill="#d04796"/>
			<path d="m392.97 862.1 10.48-46.72 7.584-1.4126 14.268 44.573z" display="inline" fill="#d5589f"/>
			<path d="m394.64 820.67-24.911 43.125 31.339 23.304c15.739-1.0909 31.284-3.6106 45.357-7.0816l18.617-30.105-38.796-34.51" fill="none" stroke="#e40884" stroke-width="1.4"/>
			<path d="m369.73 863.79c26.985-0.30075 77.288-7.2829 95.314-13.883" fill="none" stroke="#e40884" stroke-width="1.4"/>
		</g>
		<g>
			<path d="m18.092 49.348c4.3579-15.458 27.423-40.135 56.351-40.473-9.5959 4.8007-12.992 10.457-15.149 15.293 57.202-21.467 56.855 9.4489 73.409 10.7 7.3172 0.55311 6.766-12.503 3.1123-19.473 11.766 4.2634 16.292 26.585 6.3832 37.697-9.026 10.123-27.082 14.86-39.373 10.1 6.0622 8.2122 7.3138 13.907 8.5399 21.524-11.851-10.555-48.182-21.657-71.656-12.036" display="inline" fill="#cba20d" fill-rule="evenodd"/>
			<path d="m136.22 18.571c9.9267 11.196 9.9623 20.105 8.9062 29.619 6.2405-14.336-0.93862-36.679-8.9062-29.619z" color="#000000" display="inline" fill="#f1c31f" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			<path d="m75.548 19.802c24.599-3.3452 36.153 4.6166 44.414 8.8477-10.81-12.241-34.456-15.916-44.414-8.8477z" color="#000000" display="inline" fill="#f1c31f" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
		</g>
		<path d="m25.422 48.351c62.552-37.444 96.006 15.907 121.77-6.3429" display="inline" fill="none" stroke="#7a5e00" stroke-width="1.6875"/>
		<path d="m18.092 49.348c4.3579-15.458 27.423-40.135 56.351-40.473-9.5959 4.8007-12.992 10.457-15.149 15.293 57.202-21.467 56.855 9.4489 73.409 10.7 7.3172 0.55311 6.766-12.503 3.1123-19.473 11.766 4.2634 16.292 26.585 6.3832 37.697-9.026 10.123-27.082 14.86-39.373 10.1 6.0622 8.2122 7.3138 13.907 8.5399 21.524-11.851-10.555-48.182-21.657-71.656-12.036" display="inline" fill="none" stroke="#7a5e00" stroke-miterlimit="6" stroke-width="2.8125"/>
		<g transform="translate(-225.14 -151.56)" display="inline">
			<path d="m263.87 264.97c-39.987-23.122-43.302-47.787-31.911-75.82 21.438 3.4613 37.053 19.334 39.83 41.205" display="inline" fill="#e8c043" fill-rule="evenodd"/>
			<path d="m227.81 201.21c1.1884 24.079 11.765 40.963 36.068 63.759-26.497-15.867-41.891-38.121-36.068-63.759z" display="inline" fill="#cca213"/>
			<path d="m238.42 205.02c-4.1537 15.107 3.5497 29.157 15.964 32.263-11.565-6.6501-16.786-18.292-15.964-32.263z" color="#000000" display="inline" fill="#7a5e00" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			<path d="m231.27 187.66c-14.599 39.029-2.8508 57.139 32.607 77.312-1.9716-1.4912-2.9378-3.4073-4.8031-4.7163-33.309-23.377-35.199-39.662-26.367-69.627 20.059 4.0121 35.429 18.225 39.089 39.728 0.72262-26.025-20.998-39.784-40.527-42.696z" color="#000000" display="inline" fill="#7a5e00" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
		</g>
	</g>
	<g id="ts" transform="translate(12.759 20.073)" display="none">
		<g transform="translate(-207.41 110.92)">
			<g>
				<path d="m239.23-64.64c23.633-34.075 52.807-36.246 83.538-27.288l19.754 9.8772c19.645 13.726 24.386 22.524 30.134 32.478-34.772 7.2202-69.125 16.542-103.46 25.949-5.6128-7.8917-10.343-16.666-17.578-22.935" display="inline" fill="#e8c043"/>
				<path d="m255.64-82.887-7.5335 6.6964c29.591 8.8065 37.816 26.088 40.848 47.042l22.935-5.5246c-13.269-18.675-25.644-37.775-56.25-48.214z" display="inline" fill="#f1da6c"/>
				<path d="m253.46-80.544 2.0089-2.6786c28.098-2.8808 56.208 21.861 60.603 46.54l-11.049 3.3482c-13.954-25.73-30.151-42.277-51.563-47.21z" display="inline" fill="#cba20d"/>
				<path d="m341.05-79.099c10.94 7.2994 20.152 16.604 28.972 26.805l0.86426-2.2517c-8.9495-10.351-18.046-19.688-28.927-26.953m-19.418-9.7816c-9.8015-3.486-21.055-5.5331-34.419-5.7163l-1.2011 2.034c13.177 0.18066 24.429 2.278 34.31 5.8312" color="#000000" display="inline" fill="#f4df86" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			</g>
			<path d="m237.01-61.602c23.4-37.58 55.027-39.284 85.758-30.326l19.754 9.8772c19.645 13.726 24.386 22.524 30.134 32.478-34.772 7.2202-69.125 16.542-103.46 25.949-4.2107-9.5274-14.666-21.924-20.499-23.052" display="inline" fill="none" stroke="#7a5e00" stroke-width="2.2997"/>
			<g>
				<path d="m310.71-72.675s33.15-54.218 40.681-50.391c8.7156 4.4295-21.931 70.145-21.931 70.145" display="inline" fill="#e8c043"/>
				<path d="m347.21-121.73c5.8878 2.4175-13.839 39.453-23.772 59.431l6.1942 9.375c4.5201-10.714 35.595-78.884 17.578-68.806z" display="inline" fill="#cca213"/>
				<path d="m336.42-106.39c-6.7109 8.6997-15.9 23.339-22.367 35.468l3.2735 2.9966c4.5557-9.3165 14.63-29.403 19.094-38.465z" color="#000000" display="inline" fill="#eecf65" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			</g>
			<g fill="none" stroke="#7a5e00">
				<path d="m310.71-72.675s33.15-54.218 40.681-50.391c8.7156 4.4295-21.931 70.145-21.931 70.145" display="inline" stroke-width="2.2997"/>
				<path d="m319.08-85.566c2.4397 8.7451 4.7926 17.538 15.067 21.931" display="inline" stroke-width="1.5938"/>
				<path d="m334.32-107.16c1.4199 7.3323 3.9177 14.077 10.212 18.75" display="inline" stroke-width="1.5"/>
			</g>
			<path d="m296.89-79.008c22.696 10.412 27.937 23.641 35.784 31.126-3.3665-11.793-17.633-28.056-35.784-31.126z" color="#000000" display="inline" fill="#7a5e00" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
		</g>
		<g transform="translate(-207.41 110.92)">
			<g>
				<path d="m235.8-8.8081c-0.66674 27.022 5.3236 48.918 42.522 91.071l-6.9476 30.05c-5.4813-3.903-14.317-14.314-19.587-22.266 5.255 16.437 9.8101 26.2 15.737 35.156l-9.5424 35.658c-24.87-26.498-46.68-59.733-27.706-174.36" display="inline" fill="#e8c043"/>
				<path d="m263.67 139.6-4.3527 15.904c-18.656-17.589-41.051-65.951-31.891-143.59 7.4737 49.169 13.139 101.09 36.244 127.68z" display="inline" fill="#f1da6c"/>
				<path d="m227.51 11.03c1.7365 50.62 9.5288 108.98 34.458 134.28l3.5444-11.066c-23.075-25.793-29.663-66.972-38.002-123.21z" display="inline" fill="#cba20d"/>
			</g>
			<path d="m235.8-8.8082c-0.66674 27.022 5.3236 48.918 42.522 91.071l-6.9476 30.05c-5.4813-3.903-14.317-14.314-19.587-22.266 5.255 16.437 9.8101 26.2 15.737 35.156l-9.5424 35.658c-24.87-26.498-46.68-59.733-27.706-174.36" display="inline" fill="none" stroke="#7a5e00" stroke-miterlimit="8" stroke-width="2.2997"/>
		</g>
		<g transform="translate(-225.14 -151.56)" display="inline">
			<path d="m446.43 880.01 18.259-29.906-94.702 13.89 31.315 23.36c15.208-1.5288 30.157-4.3835 45.128-7.343z" display="inline" fill="#e01a1d"/>
			<path d="m395.11 820.05-25.381 43.736c16.143 0.18274 95.784-10.368 94.955-13.684l-38.437-34.709z" display="inline" fill="#ff1b01"/>
			<path d="m446.38 854.78-28.663-40.785-7.1973 1.894 11.364 43.184-0.12627 26.011 17.516-3.7289z" display="inline" fill="#fff" fill-opacity=".26"/>
			<path d="m425.3 858.54-32.08 3.6855 12.122 24.496 19.193-2.5254z" display="inline" fill="#ff2713"/>
			<path d="m392.97 862.1 10.48-46.72 7.584-1.4126 14.268 44.573z" display="inline" fill="#ff4126"/>
			<path d="m394.64 820.67-24.911 43.125 31.339 23.304c15.739-1.0909 31.284-3.6106 45.357-7.0816l18.617-30.105-38.796-34.51" fill="none" stroke="#bf000f" stroke-width="1.4"/>
			<path d="m369.73 863.79c26.985-0.30075 77.288-7.2829 95.314-13.883" fill="none" stroke="#bf000f" stroke-width="1.4"/>
		</g>
		<g transform="translate(-225.14 -151.56)" display="inline">
			<path d="m263.87 264.97c-39.987-23.122-43.302-47.787-31.911-75.82 21.438 3.4613 37.053 19.334 39.83 41.205" display="inline" fill="#e8c043" fill-rule="evenodd"/>
			<path d="m227.81 201.21c1.1884 24.079 11.765 40.963 36.068 63.759-26.497-15.867-41.891-38.121-36.068-63.759z" display="inline" fill="#cca213"/>
			<path d="m238.42 205.02c-4.1537 15.107 3.5497 29.157 15.964 32.263-11.565-6.6501-16.786-18.292-15.964-32.263z" color="#000000" display="inline" fill="#7a5e00" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			<path d="m231.27 187.66c-14.599 39.029-2.8508 57.139 32.607 77.312-1.9716-1.4912-2.9378-3.4073-4.8031-4.7163-33.309-23.377-35.199-39.662-26.367-69.627 20.059 4.0121 35.429 18.225 39.089 39.728 0.72262-26.025-20.998-39.784-40.527-42.696z" color="#000000" display="inline" fill="#7a5e00" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
		</g>
	</g>
	<g id="aj" transform="translate(12.759 20.073)" display="none">
		<g transform="translate(-207.55 115.87)">
			<path d="m236.88-57.86c23.994-73.199 115.03-32.23 112.96-20.622-0.61365 3.4529-11.445-0.4069-14.482-1.1079 13.493 7.5699 17.666 14.683 21.351 21.259 3.5403 6.3175 9.8008 10.211 22.907 11.023-13.085 15.303-50.746 13.33-67.411 0.37089 2.466 5.9603 3.4212 10.236 9.905 13.847-9.2663 0.91822-20.741-6.3921-30.445-12.635 4.4273 8.5698 4.5364 13.868 4.1449 19.283-10.871-9.1237-28.507-16.697-44.88-19.543" fill="#e8c043" fill-rule="evenodd"/>
			<path d="m281.95-98.198c4.0863-0.60206 13.376-0.71781 24.844 1.6113 11.468 2.3291 25.18 7.0835 38.438 16.143 0.5929 0.40515 0.71776 0.77484 0.73243 0.99609 0.0146 0.22125-0.0483 0.33779-0.20508 0.43945l1.4221 2.0824c17.389-9.7631-53.364-30.465-65.231-21.272z" color="#000000" display="inline" fill="#f2d776" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			<path d="m366.02-39.828c-16.217-2.866-22.128-8.9412-33.26-27.461-14.017-23.32-51.928-32.852-85.117-12.314" display="inline" fill="none" stroke="#7a5e00" stroke-width=".9375px"/>
			<path d="m340.69-36.75c-25.659-18.322-29.264-55.544-98.016-33.382" display="inline" fill="none" stroke="#7a5e00" stroke-width=".9375px"/>
			<path d="m334.87-78.701c19.56 14.614 17.307 33.665 43.296 32.036-31.907-5.9663-14.737-18.649-43.296-32.036z" color="#000000" display="inline" fill="#f2d776" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			<path d="m236.88-57.86c23.994-73.199 115.03-32.23 112.96-20.622-0.61365 3.4529-11.445-0.4069-14.482-1.1079 13.493 7.5699 17.666 14.683 21.351 21.259 3.5403 6.3175 9.8008 10.211 22.907 11.023-13.085 15.303-50.746 13.33-67.411 0.37089 2.466 5.9603 3.4212 10.236 9.905 13.847-9.2663 0.91822-20.741-6.3921-30.445-12.635 4.4273 8.5698 4.5364 13.868 4.1449 19.283-10.871-9.1237-28.507-16.697-44.88-19.543" fill="none" stroke="#7a5e00" stroke-miterlimit="10.1" stroke-width="2.25"/>
		</g>
		<g transform="translate(-207.55 115.87)">
			<g>
				<path d="m295.94 88.481c1.3969-4.5984 1.5074-10.242 1.3839-17.183-0.78811-44.274-57.298-26.467-59.891-78.976l-10.756-9.1658c-0.42849 24.717 4.926 53.984 18.005 77.012 6.4589 20.173 2.3337 45.809 24.182 45.951 2.2245 0.0145 4.4278-0.12822 6.5661-0.45882" display="inline" fill="#e8c043"/>
				<path d="m234.38 39.825c20.724 28.314 6.9298 70.53 40.848 66.629l1.0045-3.3482c-28.986-8.2398-12.318-36.924-41.853-63.281z" display="inline" fill="#cca213"/>
				<path d="m249.3 23.149c29.142 18.443 40.162 39.736 40.959 67.949l-4.7351 1.6573c-3.0697-18.531-4.842-35.688-36.223-69.606z" display="inline" fill="#f2d776"/>
			</g>
			<g fill="none" stroke="#7a5e00">
				<path d="m295.94 88.481c1.3969-4.5984 1.5074-10.242 1.3839-17.183-0.78811-44.274-57.298-26.467-59.891-78.976l-10.756-9.1657c-0.42849 24.717 4.926 53.984 18.005 77.012 6.4589 20.173 2.3337 45.809 24.182 45.951 2.2245 0.0145 4.4278-0.12822 6.5661-0.45882" display="inline" stroke-width="2.5312"/>
				<path d="m233.91 33.566c28.086 25.244 24.984 67.325 50.192 59.662" display="inline" stroke-width=".9375px"/>
				<path d="m276.41 101.51c-14.161-0.95329-20.872-13.813-27.819-24.386" display="inline" stroke-width=".9375px"/>
			</g>
			<g>
				<path d="m284.93 132.57c-18.124-20.599-9.8557-35.134 5.1907-41.997 15.464-7.0535 39.488-5.6338 48.286 20.324-4.5968-4.1824-7.4262-6.2657-11.848-8.5982 15.061 28.522-0.0263 47.742-23.683 51.413 6.8123-4.546 8.8046-7.898 10.514-12.771-22.934 10.221-40.347-2.0046-43.771-12.252 4.7579 2.0855 9.5699 2.9701 15.311 3.8815z" fill="#e8c043" fill-rule="evenodd"/>
				<path d="m330.75 131.35c-3.7559-23.788-26.864-47.064-45.22-38.591 27.021-17.381 52.148 14.103 45.22 38.591z" display="inline" fill="#f2d776"/>
				<path d="m284.93 132.57c-5.1988-0.62809-10.332-1.717-15.311-3.8815 6.5778 15.286 27.813 19.304 43.771 12.252-2.0616 4.6169-5.1078 8.2889-8.3705 12.054 11.25-1.7142 21.25-8.4946 23.928-17.076-7.0044 6.0724-10.981 10.412-11.725 1.4692-22.892 8.2419-42.706-18.61-39.036-37.302-10.364 11.627 2.7874 29.581 6.7433 32.484z" display="inline" fill="#cca213"/>
			</g>
			<path d="m276.53 103.88c9.4994 20.05 19.735 26.648 32.672 25.806-2.3836 8.1692-11.366 13.899-22.728 13.969" display="inline" fill="none" stroke="#7a5e00" stroke-width=".9375px"/>
			<path d="m284.93 132.57c-18.124-20.599-9.8557-35.134 5.1907-41.997 15.464-7.0535 39.488-5.6338 48.286 20.324-4.5968-4.1824-7.4262-6.2657-11.848-8.5982 15.061 28.522-0.0263 47.742-23.683 51.413 6.8123-4.546 8.8046-7.898 10.514-12.771-22.934 10.221-40.347-2.0046-43.771-12.252 4.7579 2.0855 9.5699 2.9701 15.311 3.8815z" fill="none" stroke="#7a5e00" stroke-miterlimit="4.8" stroke-width="2.25"/>
		</g>
		<g transform="translate(-225.14 -151.56)" display="inline">
			<path d="m263.87 264.97c-39.987-23.122-43.302-47.787-31.911-75.82 21.438 3.4613 37.053 19.334 39.83 41.205" display="inline" fill="#e8c043" fill-rule="evenodd"/>
			<path d="m227.81 201.21c1.1884 24.079 11.765 40.963 36.068 63.759-26.497-15.867-41.891-38.121-36.068-63.759z" display="inline" fill="#cca213"/>
			<path d="m238.42 205.02c-4.1537 15.107 3.5497 29.157 15.964 32.263-11.565-6.6501-16.786-18.292-15.964-32.263z" color="#000000" display="inline" fill="#7a5e00" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
			<path d="m231.27 187.66c-14.599 39.029-2.8508 57.139 32.607 77.312-1.9716-1.4912-2.9378-3.4073-4.8031-4.7163-33.309-23.377-35.199-39.662-26.367-69.627 20.059 4.0121 35.429 18.225 39.089 39.728 0.72262-26.025-20.998-39.784-40.527-42.696z" color="#000000" display="inline" fill="#7a5e00" style="text-decoration-line:none;text-indent:0;text-transform:none"/>
		</g>
	</g>
	<g id="scepter_trim" transform="translate(12.759 20.073)">
		<g transform="translate(-225.14 -151.56)">
			<g>
				<path d="m390.8 803.52 0.89286 16.429c10.589 0.69839 28.131-2.8414 37.589-5.8036l-5.1786-16.25c-7.7087 1.5751-0.0761 1.4326-33.304 5.625z" fill="#e8c043"/>
				<path d="m407.61 801.43 1.9613 16.794 13.89-2.7779-4.0734-15.921z" fill="#f2d776"/>
				<path d="m398.28 802.63 1.6732 17.026-7.4991 0.52499-1.2122-16.601" fill="#cca213"/>
			</g>
			<path d="m390.8 803.52 0.89286 16.429c10.589 0.69839 28.131-2.8414 37.589-5.8036l-5.1786-16.25c-7.7087 1.5751-0.0761 1.4326-33.304 5.625z" fill="none" stroke="#7a5e00" stroke-width="1.8"/>
		</g>
	</g>
	<g id="aj_over" transform="translate(12.759 20.073)" display="none">
		<g transform="rotate(1.2714 -6267.2 -8520.4)" display="inline">
			<g>
				<path d="m370.78 541.58-31.615 0.49935 39.2 46.965 7.7355-0.79109z" display="inline" fill="#e01a1d"/>
				<path d="m399.4 539.35-33.939 8.6093 18.395 40.711 25.025-3.372z" display="inline" fill="#ff2713"/>
				<path d="m428.16 536.2-32.641 7.1447 5.741 42.444 20.594-2.8817z" display="inline" fill="#ff7d6d"/>
				<path d="m424.93 583.13 15.604-59.773-17.445-1.4437 1.9747 16.835-3.436 43.815z" display="inline" fill="#e01a1d"/>
				<path d="m357.19 515.95-17.481 26.639 26.489 7.2757 5.3546-0.56243 1.4646-29.643z" display="inline" fill="#ff1b01"/>
				<path d="m411.41 505.38 29.894 18.14-15.532 15.652-3.4829 0.30348-20.762-25.782z" display="inline" fill="#ff2713"/>
				<path d="m366.23 549.51 3.6311-29.737 20.046-3.6662 6.0106 28.562z" display="inline" fill="#ff4126"/>
				<path d="m425.01 539.13-23.523-25.68-13.277 2.9476 7.3057 28.431z" display="inline" fill="#ff7d6d"/>
			</g>
			<path d="m370.15 519.12-12.891-3.0134-18.08 25.949 39.844 47.545 45.871-6.8638 16.406-59.263-29.297-18.08-10.379 8.2031z" display="inline" fill="none" stroke="#bf000f" stroke-width="1.6875"/>
			<path d="m339.68 542.06 26.618 8.2031 58.761-11.049 15.569-15.402" display="inline" fill="none" stroke="#bf000f" stroke-width="1.5"/>
		</g>
	</g>
</svg>`;
  }
  
  makeStyle(`
#belle {
    transition: transform 0.07s linear;
    transform-origin: 85% 95%;
    z-index: 502;
    position: fixed;
    background-repeat: no-repeat;
    background-size: contain;
    width: 131px;
    height: 384px;}
#belle .speech_container, #belle .options_container {
    display: none;
    opacity: 0;
    position: absolute;
    top: 0px;
    width: 200px;
    transition: opacity 2s linear;}
#belle .speech_container {
    pointer-events: none;
    left: 100%;}
#belle .options_container {
    pointer-events: initial !important;
    left: -100%;}
#belle .speech, #belle .options {
    float: left;
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.2);
    padding: 6px;
    border-radius: 10px;
    font-size: 0.8em;
    text-shadow: 1px 1px rgba(255, 255, 255, 0.4);
    line-height: 1.8em;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
    margin-left: -20px;}
.cookie {
    z-index: 501;
    border-radius: 120px;
    position:absolute;
    cursor:pointer;}
.cursor_container .label, .cursor_container .label a {
    white-space: nowrap;
    display: inline-block;
    z-index: 900;
    color: #fff;
    font-weight: bold;}
.cursor_container .label {
    position: absolute;
    top: -20px;
    left: 10px;
    background: rgba(0,0,0,0.3);
    padding: 5px;
    opacity: 0;}
.cursor_container:hover .label {opacity: 1;}
.cursor, .cursor_container {
    z-index: 600;
    position: absolute;
    width: 0px;
    height: 0px;}
.cursor img {max-width: 13px;}
.cursor.click:before {
    content: "";
    position: absolute;
    top: -29px;
    left: -29px;
    border-radius: 50px;
    border: solid 5px rgba(0, 0, 255, 0.2);
    width: 50px;
    height: 50px;}
.cursor.click:after {
    content: "";
    position: absolute;
    top: -15px;
    left: -15px;
    border-radius: 50px;
    border: solid 1px rgba(0, 0, 255, 0.2);
    width: 30px;
    height: 30px;}
.cursor.smart.click:before, .cursor.smart.click:after {border-color: rgba(255, 0, 0, 0.2) !important;}
img.grabbed-image {
    outline: solid rgba(0,0,255,0.2) 10px;
    box-shadow: 1px 5px 5px rgba(0,0,0,0.7);}
img[data-dragged] {
    z-index: 501;
    position: absolute;}
.floater {
    z-index:500;
    color: white;
    pointer-events: none;
    text-shadow: 3px 3px 5px black;
    font-weight: bold;
    -{0}-animation: wobble 0.5s linear 0s infinite alternate;}
.wobbly_image {-{0}-animation: shake_shake 0.25s linear infinite;}
#belle_type + span span {
    background: rgba(255,255,255,0.6);
    border-radius: 5px;
    border: 3px solid #fff;
    padding: 5px;
    display: inline-block;
    vertical-align: middle;}
@-{0}-keyframes shake_shake {
    0% {transform: none;}
    25% {transform: rotate(-2deg);}
    50% {transform: none;}
    75% {transform: rotate(2deg);}
    100% {transform: none;}}
@-{0}-keyframes wobble {
    from {margin-left: -10px;}
    to {margin-left: 10px;}}
.musical {-{0}-animation: wub 0.8s linear 0s infinite alternate;}
@-{0}-keyframes wub {
    0% {transform: scale(1,1);}
    10% {transform: scale(1.00125,1.00125);}
    20% {transform: scale(1.0125,1.0125);}
    30% {transform: scale(1.00125,1.00125);}
    40% {transform: scale(1.0125,1.0125);}
    50% {transform: scale(1.00125,1.00125);}
    60% {transform: scale(1,1);}
    70% {transform: scale(0.99985,0.99985);}
    80% {transform: scale(1,1);}
    90% {transform: scale(1.0125,1.0125);}
    100% {transform: scale(1.00125,1.00125);}}`);
}
