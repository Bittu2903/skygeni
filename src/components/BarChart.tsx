import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  closed_fiscal_quarter: string;
  Cust_Type: string;
  acv: number;
}

interface BarChartProps {
  data: DataPoint[];
  type: 'stacked' | 'grouped';
}

export const BarChart: React.FC<BarChartProps> = ({ data, type = 'stacked' }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 40, right: 120, bottom: 60, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const quarters = Array.from(new Set(data.map(d => d.closed_fiscal_quarter))).sort();
    const customerTypes = Array.from(new Set(data.map(d => d.Cust_Type)));

    const groupedData = quarters.map(quarter => {
      const quarterData = data.filter(d => d.closed_fiscal_quarter === quarter);
      return {
        quarter,
        types: customerTypes.map(type => ({
          type,
          value: quarterData.find(d => d.Cust_Type === type)?.acv || 0
        }))
      };
    });

    const x0 = d3.scaleBand()
      .domain(quarters)
      .range([0, width])
      .padding(type === 'grouped' ? 0.2 : 0.1);

    const x1 = d3.scaleBand()
      .domain(customerTypes)
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([
        0,
        type === 'stacked'
          ? d3.max(groupedData, d => d3.sum(d.types, t => t.value)) || 0
          : d3.max(groupedData.flatMap(d => d.types.map(t => t.value))) || 0
      ])
      .range([height, 0])
      .nice();

    const color = d3.scaleOrdinal<string>()
      .domain(customerTypes)
      .range(['#2196f3', '#ff9800']);

    if (type === 'stacked') {
      const stack = d3.stack()
        .keys(customerTypes)
        .value((d: any, key) => d.types.find((t: any) => t.type === key)?.value || 0);

      const stackedData = stack(groupedData as any);

      svg.selectAll('g.stack')
        .data(stackedData)
        .join('g')
        .attr('class', 'stack')
        .attr('fill', d => color(d.key))
        .selectAll('rect')
        .data(d => d)
        .join('rect')
        .attr('x', d => x0(d.data.quarter) || 0)
        .attr('y', d => y(d[1]))
        .attr('height', d => y(d[0]) - y(d[1]))
        .attr('width', x0.bandwidth());
    } else {
      svg.selectAll('g.group')
        .data(groupedData)
        .join('g')
        .attr('transform', d => `translate(${x0(d.quarter)},0)`)
        .selectAll('rect')
        .data(d => d.types)
        .join('rect')
        .attr('x', d => x1(d.type)!)
        .attr('y', d => y(d.value))
        .attr('width', x1.bandwidth())
        .attr('height', d => height - y(d.value))
        .attr('fill', d => color(d.type));
    }

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0))
      .selectAll('text')
      .style('text-anchor', 'middle');

    svg.append('g')
      .call(
        d3.axisLeft(y).tickFormat(d => `$${d3.format('.2s')(d as number)}`)
      );

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 10}, 0)`);

    customerTypes.forEach((type, i) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      legendItem.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', color(type));

      legendItem.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text(type);
    });

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('Won ACV mix by Cust Type');

  }, [data, type]);

  return <svg ref={svgRef}></svg>;
};
