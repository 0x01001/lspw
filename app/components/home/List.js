import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';

class List extends Component {
  render() {
    return <FlatList data={this.props.data} keyExtractor={(x, i) => x.uid} renderItem={() => {}} />;
  }
}

const mapStateToProps = state => ({ data: state.list });

export default connect(mapStateToProps)(List);
