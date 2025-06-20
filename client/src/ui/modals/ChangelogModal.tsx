import './ChangelogModal.scss';

function ChangelogModal() {
  return (
    <div className="changelog">
      <h1 style={{ fontSize: 30, color: 'white' }}>What's new? (June 2025)</h1>
      <ul style={{ fontSize: 22, color: '#ffffcc' }}>
        🎮 <span style={{ color: '#ffff00' }}>Swordbattle.io</span> is now live on{' '}
        <span style={{ color: '#00ff88' }}>Nova Crafter Lab</span>!
      </ul>
      <ul style={{ fontSize: 15, color: '#ffffee' }}>
        - Welcome to our revolutionary Web3 gaming platform
      </ul>
      <ul style={{ fontSize: 15, color: '#ffffee' }}>
        - Introducing <span style={{ color: '#00ff88' }}>Gameme</span> - where gaming meets meme culture
      </ul>
      <ul style={{ fontSize: 15, color: '#ffffee' }}>
        - We're pioneering the fusion of viral memes with engaging gameplay
      </ul>
      <br></br>
      <ul style={{ fontSize: 18, color: '#77aaff' }}>
        🚀 What is Gameme?
      </ul>
      <ul style={{ fontSize: 14, color: '#cccccc' }}>
        - Gameme combines the viral nature of memes with the addictive fun of gaming
      </ul>
      <ul style={{ fontSize: 14, color: '#cccccc' }}>
        - Our platform leverages meme culture's spreadability to promote Web3 adoption
      </ul>
      <ul style={{ fontSize: 14, color: '#cccccc' }}>
        - Experience games that are both entertaining and culturally relevant
      </ul>
      <br></br>
      <ul style={{ fontSize: 16, color: '#ffaa00' }}>
        🎯 Our Mission
      </ul>
      <ul style={{ fontSize: 14, color: '#ffccff' }}>
        - Making Web3 accessible through the universal language of memes
      </ul>
      <ul style={{ fontSize: 14, color: '#ffccff' }}>
        - Creating games that players love to share and discuss
      </ul>
      <ul style={{ fontSize: 14, color: '#ffccff' }}>
        - Building a community where creativity meets blockchain innovation
      </ul>
      <br></br>
      <ul style={{ fontSize: 16, color: '#ffff00' }}>
        🔥 Get ready for the future of gaming!
      </ul>
      {/* <p style={{fontSize: 16, color: 'lightblue'}}>Join the <a href="https://discord.com/invite/9A9dNTGWb9" className="primary-link" target="_blank" rel="nofollow">Swordbattle.io Discord Server</a> to learn more about these updates on the full changelog!</p> */}
    </div>
  );
}

/* <a className="primary-link" target="_blank" href="https://iogames.forum/t/how-to-make-your-own-swordbattle-io-skin/585">
Create your own skins to be added in the game!

<li className='announcement'>NOTE: The game is currently being tested for bugfixes. Expect the possibility disconnects/server restarts.</li>
</a> */

export default ChangelogModal;
