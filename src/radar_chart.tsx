
import React from 'react';
import { GridLabelProps, ResponsiveRadar } from '@nivo/radar'
import { useActiveViewId, useCloudStorage, useFields, useRecords, useSelection } from '@vikadata/widget-sdk';


export const RadarChart: React.FC = () => {
  // 新建图表需要的上下文

  const activeViewId = useActiveViewId()
  const selection = useSelection()
  const selectedRecords = useRecords(activeViewId, {ids: selection?.recordIds})
  const fields = useFields(activeViewId)
  const [dimensions] =useCloudStorage<[string, string][]>('dimensions')

  const defaultCustomConfig = {
    "gridShape": "linear"
  }
  const [customeConfig] = useCloudStorage<any>('customeConfig', defaultCustomConfig)

  let data:any = []
  let radarKeys:string[] = []

  if(dimensions){
    dimensions.forEach(dimension => {
      data.push({
        "dimension": dimension[1],
        "fieldId": dimension[0]
      })
    })
  
    data.forEach(item => {
      
  
      for (let index = 0; index < selectedRecords.length; index++) {
        const record = selectedRecords[index]
        const recordName = record.getCellValueString(fields[0].id) || "(空值)"
  
        item[recordName] = record.getCellValueString(item.fieldId) || "(空值)"
        radarKeys.push(record.getCellValueString(fields[0].id) || "(空值)")
      }
    })
    
    radarKeys = Array.from(new Set(radarKeys))
  }
  

  console.log("data", data)

  return (
    <ResponsiveRadar
      data={data}
      keys={radarKeys}
      indexBy="dimension"
      maxValue="auto"
      margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
      curve="linearClosed"
      borderWidth={2}
      borderColor={{ from: 'color', modifiers: [] }}
      gridLevels={4}
      gridShape={customeConfig.gridShape || "circular"}
      gridLabelOffset={18}
      gridLabel={LabelComponent}
      enableDots={true}
      dotSize={10}
      dotColor="#ffffff"
      dotBorderWidth={3}
      dotBorderColor={{ from: 'color', modifiers: [] }}
      enableDotLabel={false}
      dotLabel="value"
      dotLabelYOffset={-11}
      colors={{ scheme: 'pastel1' }}
      fillOpacity={0.25}
      blendMode="darken"
      animate={true}
      isInteractive={true}
      legends={[
        {
          anchor: 'top-left',
          direction: 'column',
          translateX: -50,
          translateY: -40,
          itemWidth: 80,
          itemHeight: 20,
          itemTextColor: '#999',
          symbolSize: 12,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: '#000'
              }
            }
          ]
        }
      ]}
      valueFormat={(value, key) => {
        return `${Number(value).toLocaleString()} x ⭐`
      }}
    />
  );
}

const LabelComponent = ({ id, x, y, anchor }: GridLabelProps) => {
  const x_offset:number = id.length/2 * -28

  return(
    <g transform={`translate(${x}, ${y})`}>
        <g transform={`translate(${anchor === 'end' ? x_offset : anchor === 'middle' ? -28 : 0}, 0)`}>
            <text 
              style={{
                fontWeight: 'bold',
                fill: '#3a9896'
              }}
            >
              {id}
            </text>
        </g>
    </g>
  )
}
