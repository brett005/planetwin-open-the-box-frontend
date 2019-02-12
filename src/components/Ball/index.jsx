import React, { Component } from 'react';
import style from './index.scss';
import Config from '../../config';
import Axios from 'axios';

const gravity = -0.008;
const friction = 0.999;
const maxScale = 0.7;
const rotation = 3;

const randomRange = (min, max) => {
  return Math.random() * max + min;
};

class Ball extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      closed: true,
      fog: false,
      open_half: false,
      open_top: false
    };
    this.balls = [
      ...Config.images.balls,
      ...Config.images.balls,
      ...Config.images.balls,
      ...Config.images.balls,
      ...Config.images.balls,
      ...Config.images.balls,
      ...Config.images.balls,
      ...Config.images.balls
    ];
    this.ballRefs = this.balls.map(() => {
      return React.createRef();
    });

    this.ballProps = this.balls.map(() => {
      const x = randomRange(-2, 4);
      const y = randomRange(-80, 160);

      return {
        velocity: {
          x,
          y
        },
        x: 0,
        y: 0,
        t: 0,
        gMod: Math.random(),
        hideTime: 2 + Math.random(),
        rotation: Math.random() > 0.5 ? -0.1 : 0.1,
        scale: (Math.random() * 30 + 10) / 500
      };
    });
    this.fogRef = React.createRef();
    this.prize = React.createRef();
    this.prizeWrap = React.createRef();
    this.ballContainer = React.createRef();
    this.open = this.open.bind(this);
    this.loop = this.loop.bind(this);
  }

  componentDidMount() {
    if (Config.prize) {
      if (this.props.middle) {
        this.props.parent.setState({
          url: Config.prize.url
        });
        this.open();
      }
      this.setState({
        noAnimate: true,
        winMessage: Config.prize.message
      });
    }
  }

  startAnimation() {
    const interval = setInterval(this.loop, 3);
    setTimeout(() => {
      clearInterval(interval);
      this.ballContainer.current.style.display = 'none';
    }, 10000);
  }

  animate(element) {
    const a = 0.008;
    const g = 1.3;

    element.x += element.velocity.x / 2;
    element.velocity.x *= friction;
    element.velocity.y *= friction;
    element.t += 0.8;
    if (element.rotation > 0) {
      element.rotation += rotation;
    } else {
      element.rotation -= rotation;
    }
    element.y =
      (a / 2) * element.t * element.t -
      (g + element.gMod) * element.t +
      element.velocity.y;
    if (element.scale <= maxScale) {
      element.scale += 0.002;
    }
    element.hideTime -= 0.005;
  }

  loop() {
    this.ballRefs.forEach((ref, index) => {
      this.animate(this.ballProps[index]);
      //ref.current.style.top = this.ballProps[index].y + 'px'
      //ref.current.style.left = this.ballProps[index].x + 'px'
      if (this.ballProps[index].hideTime < 0) {
        ref.current.classList.add('hide');
        setTimeout(() => {
          ref.current.style.display = 'none';
        }, 300);
      }
      ref.current.style.transformOrigin = 'center center';
      ref.current.style.left = `${this.ballProps[index].x + 'px'}`;

      ref.current.style.top = `${this.ballProps[index].y + 'px'}`;

      ref.current.style.transform = `rotate(${
        this.ballProps[index].rotation
      }deg) scale(${this.ballProps[index].scale})`;
    });
  }

  open() {
    if (Config.get('open')) {
      return 0;
    }
    Axios.post(Config.api.prize, {
      game: Config.game
    })
      .then(req => {
        Config.set('open', true);
        console.log(req);
        this.setState({
          winMessage: req.data.prize.message,
          open: true,
          open_half: true,
          closed: false,
          fog: true
        });
        this.props.parent.setState({
          url: req.data.prize.url
        });
        this.fogRef.current.style.opacity = 0.5;
        setTimeout(() => {
          this.setState({
            open_half: false,
            open_top: true
          });
          this.fogRef.current.style.opacity = 1;
          this.prize.current.classList.add('animatePrize');
          this.prizeWrap.current.classList.add('animatePrize');
        }, 150);
        if (!this.state.noAnimate) {
          this.startAnimation();
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <div className={style.ball}>
        {
          <div
            onClick={this.open}
            className={`closed ${this.state.closed ? 'show' : 'hide'}`}>
            <img src={Config.images.box} alt="box" />
          </div>
        }
        {
          <div
            style={{ position: this.state.open ? 'display' : 'none' }}
            className="open">
            <img
              className={`box-top ${this.state.open_top ? 'show' : 'hide'}`}
              src={Config.images['box-top']}
              alt="box"/>
            <img
              className={`box-top-half ${
                this.state.open_half ? 'show' : 'hide'
              }`}
              src={Config.images['box-top-half']}
              alt="box"/>
            <div
              ref={this.prizeWrap}
              className={`prize-wrapper ${this.state.open ? 'show' : 'hide'}`}/>
            <div
              ref={this.prize}
              className={`prize ${this.state.open ? 'show' : 'hide'}`}>
              <p dangerouslySetInnerHTML={{ __html: this.state.winMessage }} />
            </div>
            <img
              ref={this.fogRef}
              className={`fog ${this.state.fog ? 'show' : 'hide'}`}
              src={Config.images.fog}
              alt="fog"/>
            <img
              className={`box-bottom ${this.state.open ? 'show' : 'hide'}`}
              src={Config.images['box-bottom']}
              alt="box"/>
            <div
              ref={this.ballContainer}
              className={`balls ${
                this.state.open && !this.state.noAnimate ? 'show' : 'hide'
              }`}>
              {this.balls.map((ball, index) => {
                // eslint-disable-next-line
                return (
                  <img
                    key={ball + index}
                    ref={this.ballRefs[index]}
                    src={ball}
                    alt="ball"/>
                );
              })}
            </div>
            <div
              id="preload"
              style={{ left: '-10000px', position: 'absolute' }}>
              {this.balls.map((ball, index) => {
                // eslint-disable-next-line
                return <img key={ball + index} src={ball} alt="ball" />;
              })}
            </div>
          </div>
        }
      </div>
    );
  }
}

export default Ball;
