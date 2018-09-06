import React, { Component } from 'react'
import { FlatList } from 'react-native'
import { connect } from 'react-redux'

class List extends Component {
  render() {
    const { data } = this.props
    return (
      <FlatList
        data={data}
        keyExtractor={(x, i) => x.uid}
        renderItem={() => {
          console.log('')
        }}
      />
    )
  }
}

const mapStateToProps = state => ({ data: state.list })

export default connect(mapStateToProps)(List)
