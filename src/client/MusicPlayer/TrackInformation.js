import * as React from 'react';
import styled from 'react-emotion';

const TrackInformationContainer = styled('div') `
  width: 80%;
  margin: auto;
  text-align: center;
  position: relative;
`;

const TrackInformationName = styled('div') `
  font-size: 24px;
  margin-bottom: 10px;
  font-weight: 300;
`;

const TrackInformationArtist = styled('div') `
  font-size: 16px;
  margin-bottom: 5px;
  font-weight: 500;
`;

const TrackInformationAlbum = styled('div') `
  font-size: 12px;
  opacity: 0.5;
`;

export default class TrackInformation extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { track } = this.props;
    const { name, artist } = track;
    return (
      <TrackInformationContainer>
        <TrackInformationName>{name}</TrackInformationName>
        <TrackInformationArtist>{artist}</TrackInformationArtist>
      </TrackInformationContainer>
    );
  }
}
