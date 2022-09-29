import React, {useEffect, useState} from 'react';
import {Text, TouchableWithoutFeedback, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Checkbox} from 'native-base';

const AddOnsContainer = ({
  menuDetailsAddons,
  calculationHandler,
  setSelectedAddons,
}) => {
  const [showAddonsContainer, setShowAddonsContainer] = useState(false);
  const [addOnsItem, setAddOnsItem] = useState([]);
  useEffect(() => {
    setAddOnsItem(menuDetailsAddons);
    // return () => {
    //   false;
    // };
  }, [menuDetailsAddons]);

  useEffect(() => {
    // console.log('addOnsItem', addOnsItem);
  }, [addOnsItem]);

  const calculateAddOnsTotal = addOnsArray => {
    let addOnsPrice =
      addOnsArray &&
      addOnsArray.length > 0 &&
      addOnsArray.map(addOnsItemobj => {
        // if (addOnsItemobj.checked) {
        return (
          parseInt(addOnsItemobj.addOnsCost) * parseInt(addOnsItemobj.quantity)
        );

        // } else {
        //   return 0;
        // }
      });
    let totalAddonsPrice =
      addOnsPrice.length > 0 &&
      addOnsPrice.reduce((acc, next) => acc + next, 0);
    setSelectedAddons(addOnsArray);
    calculationHandler(totalAddonsPrice);
  };

  const changeInAddonsOption = (
    value,
    addOnsItemObject,
    index,
    addOnsItemArray,
  ) => {
    let previousArrayInString = addOnsItem;
    // let previousArrayInJson = JSON.parse(previousArrayInString);
    previousArrayInString[index] = {
      ...addOnsItemObject,
      checked: value,
    };
    // console.log(
    //   'previousArrayInJson',
    //   JSON.stringify(previousArrayInJson, null, 2),
    // );
    setAddOnsItem(previousArrayInString);
    // calculateAddOnsTotal(updatedArray);
  };

  const addOnsIncrementDecrement = (
    type,
    addOnsItemObject,
    index,
    addOnsItemArray,
  ) => {
    // console.log('addOnsItemObject', JSON.stringify(addOnsItemArray, null, 2));

    let previousArrayInString = JSON.stringify(addOnsItem);
    let previousArrayInJson = JSON.parse(previousArrayInString);

    if (type === 'increment') {
      previousArrayInJson[index] = {
        ...addOnsItemObject,
        quantity: parseInt(addOnsItemObject.quantity) + 1,
      };
      setAddOnsItem(previousArrayInJson);
    } else if (type === 'decrement') {
      previousArrayInJson[index] = {
        ...addOnsItemObject,
        quantity:
          addOnsItemObject.quantity === 0 ? 1 : addOnsItemObject.quantity - 1,
      };
      setAddOnsItem(previousArrayInJson);
    }
    calculateAddOnsTotal(previousArrayInJson);
  };

  return (
    <View>
      <TouchableWithoutFeedback
        onPress={() => setShowAddonsContainer(!showAddonsContainer)}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              color: '#2285E8',
            }}>
            Add Ons
          </Text>
          <Icon
            name={`${showAddonsContainer ? 'chevron-down' : 'chevron-right'}`}
            size={25}
            color="#2285E8"
            style={{marginHorizontal: 5}}
          />
        </View>
      </TouchableWithoutFeedback>

      {showAddonsContainer && (
        <View>
          {/* <Text
                        style={{
                          fontSize: 16,
                          fontFamily: 'Lato-Bold',
                          color: '#484848',
                        }}>
                        Choose Your Drink{' '}
                      </Text> */}
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
            }}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Lato-Bold',
                  color: '#484848',
                }}>
                Options
              </Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Lato-Bold',
                  color: '#484848',
                }}>
                Quantity
              </Text>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Lato-Bold',
                  color: '#484848',
                }}>
                Price
              </Text>
            </View>
          </View>

          {addOnsItem?.map((addOnsItemObject, index) => (
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                marginVertical: 10,
                // justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                }}>
                {/* <Checkbox
                  onChange={value =>
                    changeInAddonsOption(
                      value,
                      addOnsItemObject,
                      index,
                      addOnsItem,
                    )
                  }
                  checked={addOnsItemObject.checked}
                  color="green"
                /> */}
                <Text
                  style={{
                    color: '#484848',
                    fontSize: 14,
                    fontFamily: 'Lato-Bold',
                    marginHorizontal: 8,
                  }}>
                  {addOnsItemObject?.addOnsName}
                </Text>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <View
                  flexDirection="row"
                  alignItems="center"
                  // justifyContent="center"
                >
                  <Icon
                    name="minus-circle"
                    size={25}
                    color="#D9D9D9"
                    onPress={() =>
                      addOnsIncrementDecrement(
                        'decrement',
                        addOnsItemObject,
                        index,
                        addOnsItem,
                      )
                    }
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: '#000000',
                      marginHorizontal: 20,
                    }}>
                    {addOnsItemObject?.quantity}
                    {/* {counter} */}
                  </Text>
                  <Icon
                    name="plus-circle"
                    size={25}
                    color="#000000"
                    onPress={() =>
                      addOnsIncrementDecrement(
                        'increment',
                        addOnsItemObject,
                        index,
                        addOnsItem,
                      )
                    }

                    // onPress={() => setCounter(counter + 1)}
                  />
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  // backgroundColor: 'red',
                  // textAlign: 'right',
                  // justifyContent: 'center',
                  alignItems: 'flex-end',
                }}>
                <Text
                  style={{
                    color: '#484848',
                    fontSize: 14,
                    fontFamily: 'Lato-Bold',
                  }}>
                  ${parseFloat(addOnsItemObject?.addOnsCost)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default AddOnsContainer;
