import React from 'react';
import { useSettingsButton, useCloudStorage, FieldPicker, useActiveViewId, useFields, useViewIds } from '@vikadata/widget-sdk';
import { Button, IconButton, Select } from '@vikadata/components';
import { AddOutlined, DeleteOutlined } from '@vikadata/icons';
//import {default as RSelect} from 'react-select';

export const Setting: React.FC = () => {
  const [isShowingSettings] = useSettingsButton()

  const viewIds = useViewIds()
  const activeViewId = useActiveViewId()
  const fields = useFields(activeViewId ? activeViewId : viewIds[0])

  const defaultDimensions = [[undefined, undefined], [undefined, undefined], [undefined, undefined]]
  const defaultCustomConfig = {
    "gridShape": "linear"
  }

  const [dimensions, setDimensions] = useCloudStorage<(string|undefined)[][]>('dimensions', defaultDimensions)
  const [customeConfig, setCustomeConfig] = useCloudStorage<any>('customeConfig', defaultCustomConfig)


  const checkAndUpdateDimensionField = function (selectedFieldId: string, dimensionIndex: number) {
    fields.forEach(field => {
      if (field.id == selectedFieldId) {
        if (field.type == 'Number') {
          dimensions[dimensionIndex] = [selectedFieldId, field.name]
          setDimensions(dimensions)
        } else {
          alert("请选择一个数字类型的字段！")
        }
      }
    })
  }

  /**
   * 添加一个维度
   */
  function addDimension():void {
    if (dimensions.length < 9) {
      dimensions[dimensions.length] = [undefined, fields[0].name] //[fieldId, fieldName]
      setDimensions(dimensions)
    }
  }

  /**
   * 移除一个维度
  */
  function removeDimension(index:number):void {
    if (dimensions.length > 3) {
      console.log("removeDimension", index)
      dimensions.splice(index, 1)
      setDimensions(dimensions)
    }
  }

  const resetConfig = () => {
    setDimensions(defaultDimensions)
  }

  const changeConfig = (key, value) => {
    customeConfig[key] = value
    setCustomeConfig(customeConfig)
  }

  return isShowingSettings ? (
    <div style={{ flexShrink: 0, width: '300px', borderLeft: 'solid 1px gainsboro', paddingLeft: '16px', paddingTop: '40px', paddingRight: '16px', backgroundColor: '#fff', overflow: 'auto' }}>
      <h3>配置</h3>
      <div style={{ marginTop: '16px' }}>
        <Button onClick={resetConfig}> 重置 </Button>
      </div>

      {/* <RadioGroup name="gridShape" onChange={option => changeConfig.bind(this, "gridShape", option)}>
        <Radio value="circular">圆形</Radio>
        <Radio value="linear">矩形</Radio>
      </RadioGroup> */}

      <div style={{ marginTop: '16px' }}>
        <label style={{ fontSize: '12px', color: '#999' }}>网格</label>
        <Select
          options={[
            {
              label: "圆形",
              value: "circular"
            },
            {
              label: "矩形",
              value: "linear"
            }
          ]}
          value={customeConfig.gridShape || "cirlinearcular"}
          onSelected={(option) => {
            changeConfig("gridShape", option.value);
          }}
        />
      </div>

      <div style={{ marginTop: '16px', display: "flex", alignItems: "center" }}>
        <label style={{ fontSize: '12px', color: '#999', flexGrow: 1 }}>维度（{dimensions.length}/9）</label>
        <IconButton 
          icon={AddOutlined} 
          title={(dimensions.length >= 9) ? "最多可添加9个维度" : '添加'}
          onClick={e => addDimension()} 
          component="button" 
          disabled={dimensions.length >= 9}
        />
      </div>

      <div style={{ marginTop: '16px' }}>
        {dimensions.map((item, index) => {
          return (
            <div style={{marginBottom: "0.5em", display: "flex", alignItems: "center"}} >
              <span style={{padding: "0 0.5em"}}>#{index+1}</span>
              <div style={{flexGrow: 1, paddingRight: "0.5em"}}>
                <FieldPicker 
                  viewId={activeViewId ? activeViewId : viewIds[0]} 
                  fieldId={item[0] || fields[0].id} 
                  onChange={option => checkAndUpdateDimensionField(option.value, index)} 
                  key={"dimension_" + index}
                />
              </div>
              {(index>2) && <IconButton icon={DeleteOutlined} title='移除' style={{width: "10%"}} shape="square" onClick={e => removeDimension(index)} />}
            </div>
          )
        })}

      </div>

    </div>
  ) : null;
};
