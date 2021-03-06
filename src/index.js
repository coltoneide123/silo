import React from 'react';
import { render } from 'react-dom';

const CHALLENGES = [
  {
    instructions: "Which CSS property would we use to italicize text?",
    code: (selections)=> {
      return (<div class='answer'>
        <p class='lead pull-left'>box-shadow:</p>

        <ul class='list-inline answer-list  pull-left'>
          <li class='answer-list--filled label label-info'>
            <Option {...selections[0]}/>
          </li>
        </ul>
        <div class='clearfix'></div>
      </div>)
    },
    optionList: [
      {
        id: 0,
        label: "text-decoration",
        order: 1
      },
      {
        id: 1,
        label: "font-style",
        order: 2
      },
      {
        id: 2,
        label: "text-transform",
        order: 3
      }
    ],
    preview: {
      css: (answer)=> {
        return ```
          .italicized {
            ${answer}: italic;
          }
        ```;
      },
      html: `
        <div class="italicized">This text has been italicized.</div>
      `
    }
  },
  {
    instructions: <div>
      <p>We want to create an element that has a blue box-shadow with a blur-radius of 2px. This shadow is also offset 1 pixel to the left and 4 pixels down.</p>
      <p>Click the elements to insert them in the correct order we&rsquo;d use to write these style attributes.</p>
    </div>,
    code: (selections)=> {
      return (<div class='answer'>
        <p class='lead pull-left'>box-shadow:</p>

        <ul class='list-inline answer-list  pull-left'>
          <li class='answer-list--filled label label-info'>
            <Option label={selections[0]}/>
          </li>
          <li class='answer-list--filled label label-info'>
            <Option label={selections[1]}/>
          </li>
          <li class='answer-list--unfilled label label-info'>
            <Option label={selections[2]}/>
          </li>
          <li class='answer-list--unfilled label label-info'>
            <Option label={selections[3]}/>
          </li>
        </ul>
        <div class='clearfix'></div>
      </div>)
    },
    optionList: [
      {
        id: 0,
        label: "-4px",
        order: 1
      },
      {
        id: 1,
        label: "blue",
        order: 3
      },
      {
        id: 2,
        label: "1px",
        order: 2
      },
      {
        id: 3,
        label: "2px",
        order: 4
      }
    ]
  }
];

const sortedOptions = (list) => list.sort((a, b) => a.order >= b.order);

class Dialogue extends React.Component {

  constructor(){
    super();
    this.state = {
    };
  }

  render() {
    return(
      <div>
        <div>Success!</div>
        <button onClick={this.props.onContinue.bind(this)}>Continue</button>
      </div>
    );
  }
}

class Option extends React.Component {
  render() {
    return (<a onClick={this.props.onDeselect} href="#">{this.props.label}</a>);
  }
}

class Answer extends React.Component {
  render() {
    return (<a href='#' onClick={this.props.onSelect}><code>{this.props.label}</code></a>);
  }
}

class OptionList extends React.Component {
  render() {
    return (
      <div>
        <ul>
          {this.props.options.map((props) => {
            return (<Option key={props.id} {...props}></Option>)
          })}
        </ul>
      </div>
    );
  }
}

class AnswerList extends React.Component {
  render() {
    return (
      <div>
        {sortedOptions(this.props.options).map((o) => {
          o.onDeselect = this.props.onDeselect.bind(this, o);
          return <Answer key={o.id} {...o} onSelect={this.props.onSelect.bind(this, o)} />
        })}
      </div>
    );
  }
}

class Challenge extends React.Component {
  constructor() {
    super();
    this.state = {
      selections: [],
      complete: false
    }
  }

  onSelect(option) {
    if (this.state.selections.find((o) => o.id === option.id) != null) {
      return false;
    }
    this.setState({
      selections: this.state.selections.concat([option])
    });
  }

  onDeselect(option) {
    this.setState({
      selections: this.state.selections.filter((o) => o.id != option.id)
    });
  }

  onPassChallenge(){
    this.setState({complete: true});
  }
  render () {
    var challengeClass = 'challenge';
    if(this.state.complete)
      challengeClass += ' is-complete';
      
    return (
      <div className={challengeClass}>
        <div className="question">
          <h3>{this.props.instructions}</h3>
        </div>
        <div className="code">
          {this.props.code(this.state.selections)}
        </div>
        <div className="options">
          <AnswerList onSelect={this.onSelect.bind(this)} onDeselect={this.onDeselect.bind(this)} options={this.props.optionList} />
        </div>
        <div className="dialogue">
          <Dialogue onContinue={this.props.onAdvance.bind(this)}/>
        </div>
      </div>);
  }
}

class Challenges extends React.Component {
  constructor() {
    super();
    this.challenges = CHALLENGES;
    this.state = {
      challengeIndex: 0,
      challengeLength: this.challenges.length
    };
  }

  onContinue() {
    let nextChallengeIndex = this.state.challengeIndex + 1;
    if (this.state.challengeIndex >= this.state.challengeLength) {
      nextChallengeIndex = 0;
    }
    this.setState({
      challengeIndex: nextChallengeIndex
    });
  }

  render() {
    return (
      <Challenge onAdvance={this.onContinue.bind(this)} {...this.challenges[this.state.challengeIndex]} />
    );
  }
}

render(
  <Challenges />,
  document.getElementById('app')
);
