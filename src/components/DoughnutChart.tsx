import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DoughnutChartProps {
  data: { Cust_Type: string; acv: number }[];
  total: number;
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, total }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.Cust_Type))
      .range(['#2196f3', '#ff9800']);

    const pie = d3.pie<{ Cust_Type: string; acv: number }>()
      .value(d => d.acv)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<{ Cust_Type: string; acv: number }>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.8);

    const labelArc = d3.arc<d3.PieArcDatum<{ Cust_Type: string; acv: number }>>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    const arcs = svg.selectAll('g.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc as any)
      .attr('fill', d => color(d.data.Cust_Type));

    arcs.append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text(d => `${d.data.Cust_Type} (${Math.round((d.data.acv / total) * 100)}%)`);

    // Add center text using tspans
    const centerText = svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.4em')
      .style('font-size', '16px')
      .style('font-weight', 'bold');

    centerText.append('tspan')
      .attr('x', 0)
      .text('Total');

    centerText.append('tspan')
      .attr('x', 0)
      .attr('dy', '1.2em')
      .text(`$${d3.format('.3s')(total)}`);

  }, [data, total]);

  return <svg ref={svgRef}></svg>;
};
