<h1 align="center">Tambay sa VC bot</h1>
NodeJS script that make Discord selfbots <b>Join</b> and <b>Stay</b> in a Voice Channel
<br>

<h2>How to use</h2>

<ul>Put as many tokens as you want</ul>
<ul>
<ul>
<pre>
const bots = [
  `${process.env.TOKEN1}`,
];
</pre>
</ul>
</ul>

<ul>Add your main Account ID</ul>
<ul>
<ul>
<pre>
// Return if message is not from the owner
if (msg.author.id != `${process.env.OWNER_ID}`) { return };
</pre>
</ul>
</ul>

<ul>Send the command to make the bot join your VC</ul>
<ul>
<ul>
<pre>
!joinVC
</pre>
<i>note: you can also make the bot join a specific VC</i>
<pre>
!joinVC 1234567890
        ^^^^^^^^^^
      Voice Channel ID
</pre>
</ul>
</ul>

<br>
<h2>Note:</h2>
  <i>Selfbots are against the <a href="https://discord.com/terms">Discord's Terms of Service</a>. Using this script could make discord ban and terminate your account if found.</i>
  <i>I wouldn't hold any responsibilities for any cause.</i>
  <i><b>Use at your own risk</b></i>
