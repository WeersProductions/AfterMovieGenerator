import * as React from 'react';

export default class Scrubber extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    let classNames;
    const { isPlaying, onClick } = this.props;
    if (isPlaying === 'pause') {
      classNames = 'fa fa-fw fa-pause';
    } else {
      classNames = 'fa fa-fw fa-play';
    }

    return (
      <div className="Controls">
        <div onClick={onClick} onKeyDown={onClick} tabIndex={0} role="button" className="Button">
          <i className={classNames} />
        </div>
      </div>
    );
  }
}
