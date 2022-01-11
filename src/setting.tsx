import React from 'react';
import { useSettingsButton, useCloudStorage, FieldPicker, useActiveViewId, useFields, useViewIds } from '@vikadata/widget-sdk';
import { Button, Select } from '@vikadata/components';


export const Setting: React.FC = () => {
  const [isShowingSettings] = useSettingsButton()

  const viewIds = useViewIds()
  const activeViewId = useActiveViewId()
  const fields = useFields(activeViewId?activeViewId:viewIds[0])

  const defaultDimensions = [[fields[0].id, fields[0].name], [fields[0].id, fields[0].name], [fields[0].id, fields[0].name], [fields[0].id, fields[0].name]]
  const defaultCustomConfig = {
    "gridShape": "linear"
  }


  const [dimensions, setDimensions] = useCloudStorage<string[][]>('dimensions', defaultDimensions)
  const [customeConfig, setCustomeConfig] = useCloudStorage<any>('customeConfig', defaultCustomConfig)


  const checkAndUpdateSelectedDimensionField = function(selectedFieldId:string, dimensionIndex:number){
    fields.forEach(field => {
      if(field.id == selectedFieldId){
        if(field.type == 'Number'){
          dimensions[dimensionIndex] = [selectedFieldId, field.name]
          setDimensions(dimensions)
        }else{
          alert("请选择一个数字类型的字段！")
        }
      }
    })
  }

  const resetConfig = () => {
    setDimensions(defaultDimensions)
  }

  const changeConfig = (key, value) => {
    customeConfig[key] =  value
    setCustomeConfig(customeConfig)
  }

  return isShowingSettings ? (
    <div style={{ flexShrink: 0, width: '300px', borderLeft: 'solid 1px gainsboro', paddingLeft: '16px', paddingTop: '40px', paddingRight: '16px', backgroundColor: '#fff' }}>
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

      <div style={{ marginTop: '16px' }}>
        <label style={{ fontSize: '12px', color: '#999' }}>请选择第一个维度</label>
        <FieldPicker viewId={activeViewId?activeViewId:viewIds[0]} fieldId={dimensions[0][0] || fields[0].id} onChange={option => checkAndUpdateSelectedDimensionField(option.value, 0)} />
      </div>

      <div style={{ marginTop: '16px' }}>
        <label style={{ fontSize: '12px', color: '#999' }}>请选择第二个维度</label>
        <FieldPicker viewId={activeViewId?activeViewId:viewIds[0]} fieldId={dimensions[1][0] || fields[0].id} onChange={option => checkAndUpdateSelectedDimensionField(option.value, 1)} />
      </div>

      <div style={{ marginTop: '16px' }}>
        <label style={{ fontSize: '12px', color: '#999' }}>请选择第三个维度</label>
        <FieldPicker viewId={activeViewId?activeViewId:viewIds[0]} fieldId={dimensions[2][0] || fields[0].id} onChange={option => checkAndUpdateSelectedDimensionField(option.value, 2)} />
      </div>

      <div style={{ marginTop: '16px' }}>
        <label style={{ fontSize: '12px', color: '#999' }}>请选择第四个维度</label>
        <FieldPicker viewId={activeViewId?activeViewId:viewIds[0]} fieldId={dimensions[3][0] || fields[0].id} onChange={option => checkAndUpdateSelectedDimensionField(option.value, 3)} />
      </div>

      {/* <div style={{ marginTop: '16px' }}>
        <label style={{ fontSize: '12px', color: '#999' }}>请选择第五个维度</label>
        <FieldPicker viewId={activeViewId?activeViewId:viewIds[0]} fieldId={dimensions[4][0] || fields[0].id} onChange={option => 1} />
      </div> */}
    </div>
  ) : null;
};
