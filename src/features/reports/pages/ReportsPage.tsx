/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchAllReports,
  
  setFilters,
  clearFilters,
} from "../reportsSlice";
import { LoadPanel } from "devextreme-react/load-panel";
import { Button } from "devextreme-react/button";
import { SelectBox } from "devextreme-react/select-box";
import { DataGrid, Column, Paging } from "devextreme-react/data-grid";
import {
  Chart,
  Series,
  Label,
  Legend,
  Export,
  Tooltip,
  CommonSeriesSettings,
  ArgumentAxis,
  ValueAxis,
} from "devextreme-react/chart";
import PieChart, {
  Series as PieSeries,
  Label as PieLabel,
  Connector,
  Export as PieExport,
  Legend as PieLegend,
} from "devextreme-react/pie-chart";
import { formatDate } from "../../../utils/taskUtils";
import notify from "devextreme/ui/notify";
import "./ReportsPage.css";

const ReportsPage = () => {
  const dispatch = useAppDispatch();
  const {
    summary,
    projectsProgress,
    memberPerformance,
    overdueTasks,
    statusDistribution,
    priorityDistribution,
    loading,
    filters,
  } = useAppSelector((state) => state.reports);

  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    // Load all reports on mount (no filters)
    dispatch(fetchAllReports({}));
  }, [dispatch]);

  const handleApplyFilters = () => {
    const newFilters: any = {};
    if (selectedMonth) newFilters.month = selectedMonth;
    if (selectedYear) newFilters.year = selectedYear;

    dispatch(setFilters(newFilters));
    dispatch(fetchAllReports(newFilters));
    notify("Filters applied successfully", "success", 1500);
  };

  const handleClearFilters = () => {
    setSelectedMonth(null);
    setSelectedYear(null);
    dispatch(clearFilters());
    dispatch(fetchAllReports({}));
    notify("Filters cleared", "info", 1500);
  };

  const handleRefresh = () => {
    const currentFilters: any = {};
    if (filters.month) currentFilters.month = filters.month;
    if (filters.year) currentFilters.year = filters.year;
    dispatch(fetchAllReports(currentFilters));
    notify("Data refreshed", "success", 1500);
  };


  // Generate months and years for filters
  const months = [
    { value: 1, text: "January" },
    { value: 2, text: "February" },
    { value: 3, text: "March" },
    { value: 4, text: "April" },
    { value: 5, text: "May" },
    { value: 6, text: "June" },
    { value: 7, text: "July" },
    { value: 8, text: "August" },
    { value: 9, text: "September" },
    { value: 10, text: "October" },
    { value: 11, text: "November" },
    { value: 12, text: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - i,
    text: (currentYear - i).toString(),
  }));

  // Fix status distribution labels
  const fixedStatusDistribution = statusDistribution.map((item) => ({
    ...item,
    label:
      item.label === "0" || item.label === "1" || item.label === "2"
        ? ["Todo", "InProgress", "Done"][parseInt(item.label)] || item.label
        : item.label,
  }));

  // Colors for charts
  const statusColors = ["#6c757d", "#007bff", "#28a745"]; // Todo, InProgress, Done
  const priorityColors = ["#17a2b8", "#ffc107", "#dc3545"]; // Low, Medium, High

  return (
    <div className="reports-page-container">
      <LoadPanel visible={loading} />

      {/* Header */}
      <div className="reports-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="page-subtitle">
            Track your team's performance and project progress
          </p>
        </div>
        <Button
          icon="refresh"
          text="Refresh"
          onClick={handleRefresh}
          stylingMode="outlined"
        />
      </div>

      {/* Filters */}
      <div className="reports-filters">
        <div className="filter-group">
          <SelectBox
            items={months}
            value={selectedMonth}
            onValueChanged={(e) => setSelectedMonth(e.value)}
            placeholder="Select Month"
            displayExpr="text"
            valueExpr="value"
            showClearButton={true}
            width={150}
          />
          <SelectBox
            items={years}
            value={selectedYear}
            onValueChanged={(e) => setSelectedYear(e.value)}
            placeholder="Select Year"
            displayExpr="text"
            valueExpr="value"
            showClearButton={true}
            width={120}
          />
          <Button
            text="Apply Filters"
            icon="filter"
            type="default"
            onClick={handleApplyFilters}
          />
          <Button
            text="Clear"
            icon="clear"
            onClick={handleClearFilters}
            stylingMode="text"
          />
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-icon" style={{ background: "#e3f2fd" }}>
              <i className="dx-icon-folder" style={{ color: "#2196f3" }}></i>
            </div>
            <div className="card-content">
              <div className="card-value">{summary.totalProjects}</div>
              <div className="card-label">Total Projects</div>
              <div className="card-subtext">
                {summary.activeProjects} active
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon" style={{ background: "#fff3e0" }}>
              <i className="dx-icon-tasks" style={{ color: "#ff9800" }}></i>
            </div>
            <div className="card-content">
              <div className="card-value">{summary.totalTasks}</div>
              <div className="card-label">Total Tasks</div>
              <div className="card-subtext">
                {summary.completedTasks} completed
              </div>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon" style={{ background: "#e8f5e9" }}>
              <i className="dx-icon-check" style={{ color: "#4caf50" }}></i>
            </div>
            <div className="card-content">
              <div className="card-value">{summary.completionRate}%</div>
              <div className="card-label">Completion Rate</div>
              <div className="card-subtext">Overall progress</div>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon" style={{ background: "#ffebee" }}>
              <i className="dx-icon-warning" style={{ color: "#f44336" }}></i>
            </div>
            <div className="card-content">
              <div className="card-value">{summary.overdueTasks}</div>
              <div className="card-label">Overdue Tasks</div>
              <div className="card-subtext">Needs attention</div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="charts-row">
        {/* Status Distribution */}
        <div className="chart-card">
          <h3 className="chart-title">Task Status Distribution</h3>
          {fixedStatusDistribution.length > 0 ? (
            <PieChart
              id="status-chart"
              dataSource={fixedStatusDistribution}
              palette={statusColors}
              innerRadius={0.6}
            >
              <PieSeries argumentField="label" valueField="value">
                <PieLabel visible={true} format="fixedPoint">
                  <Connector visible={true} width={1} />
                </PieLabel>
              </PieSeries>
              <PieLegend
                orientation="horizontal"
                horizontalAlignment="center"
                verticalAlignment="bottom"
              />
              <PieExport enabled={false} />
            </PieChart>
          ) : (
            <div className="empty-chart">
              <i className="dx-icon-chart"></i>
              <p>No data available</p>
            </div>
          )}
        </div>

        {/* Priority Distribution */}
        <div className="chart-card">
          <h3 className="chart-title">Task Priority Distribution</h3>
          {priorityDistribution.length > 0 ? (
            <PieChart
              id="priority-chart"
              dataSource={priorityDistribution}
              palette={priorityColors}
              innerRadius={0.6}
            >
              <PieSeries argumentField="label" valueField="value">
                <PieLabel visible={true} format="fixedPoint">
                  <Connector visible={true} width={1} />
                </PieLabel>
              </PieSeries>
              <PieLegend
                orientation="horizontal"
                horizontalAlignment="center"
                verticalAlignment="bottom"
              />
              <PieExport enabled={false} />
            </PieChart>
          ) : (
            <div className="empty-chart">
              <i className="dx-icon-chart"></i>
              <p>No data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Projects Progress Chart */}
      <div className="chart-card full-width">
        <h3 className="chart-title">Projects Progress</h3>
        {projectsProgress.length > 0 ? (
          <Chart id="projects-chart" dataSource={projectsProgress}>
            <CommonSeriesSettings
              argumentField="projectName"
              type="bar"
              hoverMode="allArgumentPoints"
              selectionMode="allArgumentPoints"
            >
              <Label visible={true} format="fixedPoint" />
            </CommonSeriesSettings>
            <Series
              valueField="percentage"
              name="Completion %"
              color="#667eea"
            />
            <ArgumentAxis>
              <Label rotationAngle={-45} overlappingBehavior="rotate" />
            </ArgumentAxis>
            <ValueAxis title="Completion Percentage" />
            <Legend visible={false} />
            <Export enabled={false} />
            <Tooltip enabled={true} />
          </Chart>
        ) : (
          <div className="empty-chart">
            <i className="dx-icon-chart"></i>
            <p>No projects data available</p>
          </div>
        )}
      </div>

      {/* Team Performance Grid */}
      <div className="data-grid-card">
        <h3 className="grid-title">Team Performance</h3>
        {memberPerformance.length > 0 ? (
          <DataGrid
            dataSource={memberPerformance}
            keyExpr="userId"
            showBorders={false}
            showRowLines={true}
            showColumnLines={false}
            rowAlternationEnabled={true}
            hoverStateEnabled={true}
          >
            <Column dataField="fullName" caption="Member Name" width={250} />
            <Column
              dataField="totalTasks"
              caption="Total Tasks"
              width={120}
              alignment="center"
            />
            <Column
              dataField="completedTasks"
              caption="Completed"
              width={120}
              alignment="center"
            />
            <Column
              dataField="rate"
              caption="Completion Rate"
              width={150}
              alignment="center"
              customizeText={(data) => `${data.value}%`}
              cellRender={(data) => (
                <div className="rate-cell">
                  <div
                    className="rate-bar"
                    style={{
                      width: `${data.value}%`,
                      background:
                        data.value >= 70
                          ? "#28a745"
                          : data.value >= 40
                          ? "#ffc107"
                          : "#dc3545",
                    }}
                  ></div>
                  <span className="rate-text">{data.value}%</span>
                </div>
              )}
            />
          </DataGrid>
        ) : (
          <div className="empty-state">
            <i className="dx-icon-group"></i>
            <p>No team performance data available</p>
          </div>
        )}
      </div>

      {/* Overdue Tasks Grid */}
      <div className="data-grid-card">
        <h3 className="grid-title">Overdue Tasks</h3>
        {overdueTasks && overdueTasks.items.length > 0 ? (
          <DataGrid
            dataSource={overdueTasks.items}
            keyExpr="id"
            showBorders={false}
            showRowLines={true}
            showColumnLines={false}
            rowAlternationEnabled={true}
            hoverStateEnabled={true}
          >
            <Column dataField="title" caption="Task" width={250} />
            <Column dataField="projectName" caption="Project" width={200} />
            <Column dataField="assignedTo" caption="Assigned To" width={180} />
            <Column
              dataField="dueDate"
              caption="Due Date"
              dataType="date"
              width={130}
              customizeText={(data) => formatDate(data.value)}
            />
            <Column
              dataField="daysOverdue"
              caption="Days Overdue"
              width={130}
              alignment="center"
              cellRender={(data) => (
                <span className="overdue-badge">{data.value} days</span>
              )}
            />
            <Paging
              enabled={true}
              pageSize={10}
              pageIndex={
                overdueTasks.pagination ? overdueTasks.pagination.page - 1 : 0
              }
            />
          </DataGrid>
        ) : (
          <div className="empty-state success">
            <i className="dx-icon-check"></i>
            <p>No overdue tasks! Great work! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;