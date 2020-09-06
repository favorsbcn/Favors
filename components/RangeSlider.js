import React, { Component } from 'react'
import { Text, View, StyleSheet, Slider, TouchableOpacity, Alert } from 'react-native'
import styles from '../styles'

class RangeSlider extends Component {
  state = {
    startLabel: this.props.initialStart,
    endLabel: this.props.initialEnd,
    start: this.props.initialStart,
    end: this.props.initialEnd
  }

  updateParentState(data) {
    this.props.updateParentState(data);
  }

  handleStartValueChange = start => {
    this.setState(() => ({
      startLabel: start
    }))
  }

  handleEndValueChange = end => {
    this.setState(() => ({
      endLabel: end
    }))
  }

  render() {
    const { color, minHours, maxHours, minMinutes, maxMinutes } = this.props;
    const { start, end, startLabel, endLabel } = this.state;

    return (
      <View>
        <View style={[styles.sliders]}>

          <View style={[styles.center, { marginBottom: 36 }]}>
            <Text style={[styles.sliderLabels, { fontSize: 72, fontWeight: '200' }]}>{startLabel}:{endLabel}</Text>
            <Text style={[styles.sliderLabels, { fontSize: 20, fontWeight: '200' }]}>TimeCoins</Text>
          </View>

          <View style={{ marginBottom: 24 }}>
            <View style={{ marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
              <Text>0</Text><Text>1</Text><Text>2</Text><Text>3</Text><Text>4</Text><Text>5</Text><Text>6</Text><Text>7</Text><Text>8</Text>
            </View>
            <View style={{ marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
              <Text style={styles.gray}>|</Text><Text style={styles.gray}>|</Text><Text style={styles.gray}>|</Text><Text style={styles.gray}>|</Text><Text style={styles.gray}>|</Text><Text style={styles.gray}>|</Text><Text style={styles.gray}>|</Text><Text style={styles.gray}>|</Text><Text style={styles.gray}>|</Text>
            </View>

            <Slider
              style={styles.startSlider}
              onValueChange={this.handleStartValueChange}
              value={start}
              step={1}
              minimumValue={minHours}
              maximumValue={maxHours}
              thumbTintColor={color}
            />
          </View>

          <View style={{ marginBottom: 24 }}>
            <View style={{ marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
              <Text>0</Text><Text>15</Text><Text>30</Text><Text>45</Text>
            </View>
            <View style={{ marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
              <Text style={styles.gray}>|</Text><Text style={styles.gray}>|</Text><Text style={styles.gray}>|</Text><Text style={styles.gray}>|</Text>
            </View>
            <Slider
              style={styles.endSlider}
              onValueChange={this.handleEndValueChange}
              value={end}
              step={15}
              minimumValue={minMinutes}
              maximumValue={maxMinutes}
              thumbTintColor={color}
            />
          </View>
        </View>

        <View style={[styles.center]}>
          <TouchableOpacity style={[styles.button, styles.bold]} onPress={() => this.updateParentState({ startLabel })}>
            <Text style={styles.bold}>Donate</Text>
          </TouchableOpacity>
        </View>

      </View>
    )
  }
}

export default RangeSlider