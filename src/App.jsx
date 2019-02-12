import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import Config from './config';
import Ball from './components/Ball';
import style from './index.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: false
    };
  }

  componentDidMount() {
    const orientation = () => {
      let imgWidth = window.innerWidth;
      const ratio = 1047 / 698;
      let imgHeight = imgWidth / ratio;

      const img = document.querySelector('.background img');
      const bg = document.querySelector('.background');
      img.style.left = 0;
      if (imgHeight < window.innerHeight) {
        imgHeight = window.innerHeight;
        imgWidth = window.innerHeight * ratio;
        img.style.left = ((imgWidth - window.innerWidth) / 2) * -1 + 'px';
      }
      img.style.width = imgWidth + 'px';
      img.style.height = imgHeight + 'px';
    };
    orientation();
    window.addEventListener('resize', orientation);
  }

  render() {
    return (
      <div className={style['page-wrapper']}>
        <h1> {Config.texts.title} </h1>
        <div className={style['ball-wrapper']}>
          <Ball parent={this} />
          <Ball parent={this} middle />
          <Ball parent={this} />
        </div>

        <a
          className="button"
          style={{ opacity: this.state.url ? 1 : 0 }}
          href={Config.texts.href}
          target="_blank">
          {' '}
          {Config.texts.link}{' '}
        </a>

        <div
          className="terms"
          dangerouslySetInnerHTML={{ __html: Config.texts.terms }}/>

        {!Config.username ? (
          <section class="content overlay" style={{ display: 'flex' }}>
            <div class="username">
              <div class="username-container">
                <div class="username-label">
                  By entering your username you are opting into this particular
                  campaign
                  <br />
                  <br />
                  Enter your username:
                </div>
                <form method="POST" action={Config.api.username}>
                  <input class="username-field" name="username" type="text" />
                  <br />
                  <input type="submit" class="submit" value="Play" />
                </form>
              </div>
            </div>
          </section>
        ) : (
          ''
        )}

        <div className="background">
          <img src={Config.images['bg-landscape']} alt="background" />
        </div>
      </div>
    );
  }
}

export default App;
