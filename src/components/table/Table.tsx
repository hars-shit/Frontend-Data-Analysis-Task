import cx from 'clsx'
import { ScrollArea, Table } from '@mantine/core'
import classes from './TableStyle.module.css'
import { useState } from 'react'
import data from '../../data.json'

const getMaxMinCropsByYear = (data: any) => {
  const groupedByYear: { [key: string]: any[] } = {}

  data.forEach((entry: any) => {
    if (!groupedByYear[entry.Year]) {
      groupedByYear[entry.Year] = []
    }
    groupedByYear[entry.Year].push(entry)
  })

  const result: { [key: string]: { max: any; min: any } } = {}
  Object.keys(groupedByYear).forEach((year) => {
    const crops = groupedByYear[year]
    const validCrops = crops.filter(
      (crop: any) =>
        crop['Crop Production (UOM:t(Tonnes))'] !== '' &&
        crop['Crop Production (UOM:t(Tonnes))'] !== undefined
    )

    const maxCrop = validCrops.reduce(
      (max: any, current: any) =>
        current['Crop Production (UOM:t(Tonnes))'] >
        max['Crop Production (UOM:t(Tonnes))']
          ? current
          : max,
      validCrops[0]
    )

    const minCrop = validCrops.reduce(
      (min: any, current: any) =>
        current['Crop Production (UOM:t(Tonnes))'] <
        min['Crop Production (UOM:t(Tonnes))']
          ? current
          : min,
      validCrops[0]
    )

    result[year] = { max: maxCrop, min: minCrop }
  })

  return result
}

export const TableStyle = ({ isDark }: { isDark: boolean }) => {
  const [scrolled, setScrolled] = useState<boolean>(false)

  const maxMinCrops = getMaxMinCropsByYear(data)

  const rows = Object.keys(maxMinCrops).map((year) => {
    return (
      <Table.Tr key={year}>
        <Table.Td>{year}</Table.Td>
        <Table.Td>
          {maxMinCrops[year].max['Crop Name']} (
          {maxMinCrops[year].max['Crop Production (UOM:t(Tonnes))']} t)
        </Table.Td>
        <Table.Td>
          {maxMinCrops[year].min['Crop Name']} (
          {maxMinCrops[year].min['Crop Production (UOM:t(Tonnes))']} t)
        </Table.Td>
      </Table.Tr>
    )
  })

  const handleScroll = (event: any) => {
    const isScrolled = event.target.scrollTop !== 0
    setScrolled(isScrolled)
  }

  return (
    <ScrollArea h={700} onScroll={handleScroll}>
      <Table
        miw={700}
        withColumnBorders
        striped
        highlightOnHover
        styles={{
          th: {
            backgroundColor: isDark ? '#2b2b2b' : '#f1f3f5',
            color: isDark ? '#ffffff' : '#000000',
          },
          td: {
            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
            color: isDark ? '#eeeeee' : '#111111',
          },
          tr: {
            '&:nth-of-type(even)': {
              backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa',
            },
            '&:hover': {
              backgroundColor: isDark ? '#333' : '#e9ecef',
            },
          },
        }}
      >
        <Table.Thead
          className={cx(classes.header, { [classes.scrolled]: scrolled })}
        >
          <Table.Tr>
            <Table.Th style={{ color: isDark ? '#ddd' : '#000' }}>Year</Table.Th>
            <Table.Th style={{ color: isDark ? '#ddd' : '#000' }}>
              Crop with Maximum Production in that Year
            </Table.Th>
            <Table.Th style={{ color: isDark ? '#ddd' : '#000' }}>
              Crop with Minimum Production in that Year
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  )
}
