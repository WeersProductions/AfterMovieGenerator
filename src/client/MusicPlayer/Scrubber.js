import * as React from 'react';

export default class Scrubber extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <div className="Scrubber">
        <div className="Scrubber-Progress" />
      </div>
    );
  }
}
