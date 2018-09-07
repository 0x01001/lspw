import React, { Component } from 'react'
import { Text, View, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'

class List extends Component {
  render() {
    const {
      uid, url, username, password,
     } = this.props.data.item
    console.log('data: ', this.props.data.item)

    return (
      <TouchableWithoutFeedback>
        <View>

          <Text style={styles.titleStyle}>{url}</Text>

        </View>
      </TouchableWithoutFeedback>
    // <FlatList
    //   data={data}
    //   keyExtractor={(x, i) => x.uid}
    //   renderItem={() => {
    //     console.log('')
    //   }}
    // />
    )
  }
}

const styles = {
  titleStyle: {
    fontSize: 18,
    paddingLeft: 10,
  },
}

// const mapStateToProps = state => ({ data: state.list })

export default connect()(List)
