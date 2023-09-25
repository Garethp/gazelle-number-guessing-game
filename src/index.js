//https://gazellegames.net/forums.php?action=viewthread&threadid=28282

import { askNewQuestion, createRules } from "./process.js";
import { collapse } from "./collapseRules.js";

const game = {
  /** @var {Rule[]} **/
  rules: [],

  /** @var {number | undefined} **/
  health: undefined,

  invalids: [],
};

const getRulesPost = () => {
  console.log(game.rules);

  let rules = [
    ...game.rules
      .filter(
        (rule) =>
          rule.constructor.name !== "NoOpRule" &&
          rule.constructor.name !== "RuleNotFound"
      )
      .map((rule) => rule.toString()),
    "",
    `HP: ${game.health}`,
  ].join("\n");

  rules = `[plain]\r\n${rules}\r\n[/plain]`;

  const invalids = game.invalids
    .map(
      (invalid) =>
        `[quote=${invalid.author}|${invalid.id}]${invalid.post}[/quote]invalid`
    )
    .join(`\r\n`);

  return `${[rules, invalids].filter((text) => !!text).join(`\r\n\r\n`)}`;
};

const setHealth = (amount) => {
  let hp = parseInt(`${amount}`);
  if (isNaN(hp)) {
    hp = 250;
  }

  game.health = hp;
  $("#hp").val(hp);
};

const decreaseHealthBy = (amount) => {
  let hp = (game.health ?? 250) - amount;
  if (hp < 0) {
    hp = 0;
  }

  console.log(`Decrease HP by ${amount} now have ${hp} hp`);
  setHealth(hp);
};

var save_data_on_create_post = true;
var display_toggle = true; //show [+] to expand or contract game host information

function htmlToBBCode(html) {
  html = html.replace(/<br>\s*?<br>\s*?Last edited by([\s\S]*)<\/span>/m, "");
  html = html.replace(/<br(.*?)>/gi, "");
  html = html.replace(/<li(.*?)>(.*?)<\/li>/gi, "$2\n");
  html = html.replace(/<div(.*?)>/gi, "\n");
  html = html.replace(/<\/div>/gi, "\n");
  html = html.replace(/<td(.*?)>/gi, " ");
  html = html.replace(/<tr(.*?)>/gi, "\n");
  html = html.replace(
    /<a(.*?)href="(.*?)"(.*?)>(.*?)<\/a>/gi,
    "[url=$2]$4[/url]"
  );
  html = html.replace(/<!--(.*?)-->/gim, "\n");
  html = html.replace(/<(.*?)>/gm, "");
  html = html.replace(/&gt;/gim, ">");
  html = html.replace(/&lt;/gim, "<");
  html = html.replace(/\/\//gim, "/");
  html = html.replace(/http:\/\//gim, "http:\\");
  html = html.replace(/\r\r/gim, "");
  return html.trim();
}

const hostingtoolshtml = `<div>
    <span id="display_host" alt="Show Hosting Tools" style="cursor: pointer">[+]</span> Hosting Tools
    <form id="createpost" style="display: none; background-color: rgba(0, 0, 0, 0.3); padding: 5px;">
    <table style="background-image: none;">
        <tr>
            <td>
                <label for="rules">Rules:
            </td>
            <td class="lefty">
                <textarea id="rules" cols="90" rows="8" style="margin-top: 10px; margin-bottom: 10px;"/></label>
            </td>
            <td style="margin-top: 10px; margin-left: 50px; float: left;">
                <label for="mynumber">Number: <input type="text" id="mynumber" size=7></label>
            </td>
        </tr>
        <tr>
            <td>
                <label for="numbers">Not:
            </td>
            <td class="lefty">
                <input type="text" id="numbers" size="90">
                </label>
            </td>
        </tr>
        <tr>
            <td>
                <label for="hp">HP:
            </td>
            <td class="lefty">
                <input type="number" id="hp" size=4>
                </label>
                <input type="button" id="hp_minusrule" value="${-15}">
            </td>
        </tr>
    </table>
    <input type="button" id="save" value="Save Values">&nbsp;
    <input type="button" id="clear" value="Clear Values">
    </form>
</div>`;

(function () {
  "use strict";
  $("head").append("<style>.lefty { text-align: left; float: left;}</style>");

  // Add the [Rule] and [Number] buttons
  $('a:contains("[Quote]")').after(function () {
    return ` <a id="${this.id.replace(
      "quote",
      "rule"
    )}" data-postid="${this.id.match(/[\d]+/)}" class="rules" href="#0" style="font-size: .8em;">[Rule]</a>`;
  });

  // Display or hide our submission
  $("#reply_box").before(`${hostingtoolshtml}`);
  $("#quickreplybuttons").append(
    `<input type="submit" id="createpostbutton" value="Create Post">&nbsp;`
  );
  if (display_toggle) {
    $("#display_host").click(function () {
      if ($("#display_host").text().startsWith("[+]")) {
        $("#createpost").css("display", "block");
        $("#display_host").text("[-]");
      } else {
        $("#createpost").css("display", "none");
        $("#display_host").text("[+]");
      }
    });
  } else {
    $("#display_host").css("display", "none");
    $("#createpost").css("display", "block");
  }

  // Retrieve and save the various values
  $("#rules").val(GM_getValue("ggnnumber_rules", ""));
  $("#rules").focusout(function () {
    GM_setValue("ggnnumber_rules", $("#rules").val());
  });

  const loadRules = (rulesText) => {
    if (!rulesText) return;

    rulesText = rulesText.replace("[plain]", "").replace("[/plain]", "");
    const [_, health] = rulesText.match(/hp.\s*?(\d{1,3})/i);

    setHealth(health);

    game.rules = createRules(rulesText);

    const invalidNumbers = game.rules.filter(
      (rule) => rule.constructor.name === "RuleNotFound"
    );

    game.rules = game.rules.filter(
      (rule) =>
        rule.constructor.name !== "NoOpRule" &&
        rule.constructor.name !== "RuleNotFound"
    );

    invalidNumbers.forEach((invalid) => {
      const [_, author, id, post] = invalid.text.match(
        "\\[quote=([^|]+)\\|(.+?)\\](.*?)\\[/quote]invalid"
      );

      if (!author || !id || !post) return;

      game.invalids.push({ author, id, post });
    });

    $("#rules").val(getRulesPost());
  };

  loadRules(GM_getValue("ggnnumber_rules", ""));

  $("#numbers").val(GM_getValue("ggnnumber_numbers", ""));
  $("#numbers").focusout(function () {
    GM_setValue("ggnnumber_numbers", $("#numbers").val());
  });

  setHealth(GM_getValue("ggnnumber_hp", ""));
  $("#hp").focusout(function () {
    GM_setValue("ggnnumber_hp", $("#hp").val());
  });

  $("#mynumber").val(GM_getValue("ggnnumber_mynumber", ""));
  $("#mynumber").focusout(function () {
    GM_setValue("ggnnumber_mynumber", $("#mynumber").val());
  });

  $("#hp_minusrule").click(function () {
    decreaseHealthBy(15);
  });

  $("#createpostbutton").click(function (event) {
    if (save_data_on_create_post) {
      $("#save").click();
    }

    $("#quickpost").val($("#rules").val());
    event.preventDefault();
  });

  $("#save").click(function () {
    GM_setValue("ggnnumber_rules", $("#rules").val());
    GM_setValue("ggnnumber_numbers", $("#numbers").val());
    GM_setValue("ggnnumber_hp", $("#hp").val());
    GM_setValue("ggnnumber_mynumber", $("#mynumber").val());
    console.log("Saved Values!");
  });

  $("#clear").click(function () {
    game.rules = [];
    setHealth(undefined);

    $("#rules").val("");
    $("#numbers").val("");
    $("#hp").val("");
    $("#mynumber").val("");
    GM_deleteValue("ggnnumber_rules");
    GM_deleteValue("ggnnumber_numbers");
    GM_deleteValue("ggnnumber_hp");
    GM_deleteValue("ggnnumber_mynumber");
    console.log("Cleared all values!");
  });

  $(".rules").click(function (event) {
    let postid = $(this).data("postid");
    const postAuthor = $("#post" + postid + " a.username:first")
      .text()
      .replace("∇", "")
      .normalize();

    // Check if we posted it
    let mypost =
      $("#nav_userinfo.welcome a.username:first").text().normalize() ===
      postAuthor;

    if ($("#display_host").text().startsWith("[+]")) {
      $("#display_host").click();
    }

    // Get contents to parse
    let post;
    if (
      getSelection().toString() &&
      inPost(getSelection().anchorNode, postid) &&
      inPost(getSelection().focusNode, postid)
    ) {
      post = getSelection().toString();
    } else {
      post = htmlToBBCode(
        $("#content" + postid)
          .html()
          .trim()
      );
    }

    $("#rules").val(function (i, text) {
      if (post.match(/hp.\s*?(\d{1,3})/i) || mypost) {
        const [_, health] = post.match(/hp.\s*?(\d{1,3})/i);

        setHealth(health);
        game.rules = createRules(post);

        if (
          game.rules.filter((rule) => rule.constructor.name === "RuleNotFound")
            .length > 0
        ) {
          noty({
            type: "error",
            text: "Some text could not be parsed. See post for more detalis",
          });
        }

        return getRulesPost();
      }

      const number = parseInt($("#mynumber").val());
      if (isNaN(number)) {
        noty({
          type: "error",
          text: "Cannot add a rule without setting your number first",
        });

        return text;
      }

      if (!game.rules.length) {
        setHealth(250);
      }

      // Check if valid first
      const newRule = askNewQuestion(post, number);

      if (newRule.constructor.name === "RuleNotFound") {
        noty({
          type: "error",
          text: newRule.toString(),
        });
        return getRulesPost();
      }

      if (newRule.constructor.name === "Not" && newRule.inputs.length === 1) {
        const number = newRule.inputs[0];
        if (!game.rules.every((rule) => rule.matches(number))) {
          game.invalids.push({ author: postAuthor, id: postid, post });
        } else {
          decreaseHealthBy(1);
        }
      } else {
        decreaseHealthBy(15);
      }

      game.rules.push(newRule);
      game.rules = collapse(game.rules);

      game.rules = game.rules.sort((a, b) => a.order() - b.order());

      return getRulesPost();
    });

    $("#rule_" + postid).css("color", "red");
    $("#rules").focusout();
    event.preventDefault();
  });

  $(".numbers").click(function (event) {
    askNumberQuestion($(this).data("postid"));
    event.preventDefault();
  });

  $(".hp").click(function (event) {
    let postid = $(this).data("postid");
    if ($("#display_host").text().startsWith("[+]")) {
      $("#display_host").click();
    }
    let post;
    if (
      getSelection().toString() &&
      inPost(getSelection().anchorNode, postid) &&
      inPost(getSelection().focusNode, postid)
    ) {
      post = getSelection().toString().trim();
    } else {
      post = htmlToBBCode($("#content" + postid).html());
    }
    let m;
    if (post.length < 4 && parseInt(post)) {
      console.log("Hp Copied[0]: " + post);
      $("#hp").val(parseInt(post));
      $("#hp_" + postid).css("color", "red");
      $("#hp").focusout();
    } else if ((m = post.match(/hp[:=-]?\s?([0-9]+)/im))) {
      console.log("Hp Copied[1]: " + m[1]);
      $("#hp").val(m[1]);
      $("#hp_" + postid).css("color", "purple");
      $("#hp").focusout();
    } else if ((m = post.match(/([0-9]+)\s?hp/im))) {
      console.log("Hp Copied[2]: " + m[1]);
      $("#hp").val(m[1]);
      $("#hp_" + postid).css("color", "red");
      $("#hp").focusout();
    } else {
      console.log("HP not parsed in " + post);
      alert("Unable to parse hp in post!");
    }
    event.preventDefault();
  });
})();

function inPost(elt, id) {
  return $.contains($("#post" + id)[0], elt);
}

function askNumberQuestion(postid) {
  let numbers = $("#numbers")
    .val()
    .split(", ")
    .map((x) => parseInt(x.replace(/[,\.]/, ""), 10));
  let mypost =
    $("#nav_userinfo.welcome a.username:first").text().normalize() ===
    $("#post" + postid + " a.username:first")
      .text()
      .replace("∇", "")
      .normalize();
  let notpost = false;
  if (numbers[0] === 0 || isNaN(numbers[0])) {
    numbers.shift();
  }
  if ($("#display_host").text().startsWith("[+]")) {
    $("#display_host").click();
  }
  let post;
  if (
    getSelection().toString() &&
    inPost(getSelection().anchorNode, postid) &&
    inPost(getSelection().focusNode, postid)
  ) {
    post = getSelection().toString();
  } else {
    post = htmlToBBCode($("#content" + postid).html());
  }
  let notline;
  if ((notline = post.match(/^not[:\s=](.*)|[≠∉][:\s]?(.*)/im))) {
    post = notline[0];
    notpost = true;
  }
  let ns = post.split(/[\s]/);
  for (let i = 0; i < ns.length; i++) {
    let n = ns[i].trim().replaceAll(",", "");
    if (n === "" || isNaN(parseInt(n))) {
      continue;
    }
    n = parseInt(n);
    if (n === parseInt($("#mynumber").val())) {
      console.log("Winning number found!");
      alert("Winning Number!");
      return;
    }
    if (!numbers.includes(n)) {
      console.log("Not Number: " + n);
      if ((!mypost || !notpost) && $("#hp").val().length > 0) {
        decreaseHealthBy(1);
      }
      numbers.push(n);
    }
  }
  //$("#content"+postid).append("<br><br><span style=color:green>* Copied Number *<\span>");
  $("#number_" + postid).css("color", "red");
  numbers.sort();
  $("#numbers").val(numbers.join(", "));
  $("#numbers").focusout();
}
