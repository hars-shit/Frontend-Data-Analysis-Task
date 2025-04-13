import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { TableStyle } from "./components/table/Table";
import BarChartAverageProduction from "./components/cart/Stacked";
import { useState } from "react";

export default function App() {

  const [isDark,setIsDark]=useState<boolean>(false)
  return <MantineProvider theme={theme}>
    <div style={{padding:"1rem",backgroundColor: isDark ? "#333" : "#eee"}}>
      <div style={{textAlign:"right",marginBottom:"1rem"}}>
        <button
        onClick={()=>setIsDark(pre=>!pre)}
        style={{
          padding: "6px 12px",
          backgroundColor: isDark ? "#333" : "#eee",
          color: isDark ? "#fff" : "#000",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
        >
          {
            isDark ? "Light Mode":"Dark Mode"
          }
        </button>
      </div>
    <TableStyle isDark={isDark}/>
    <div style={{marginTop:"5rem"}}>
    <BarChartAverageProduction isDark={isDark}/>
    </div>
    </div>
  </MantineProvider>;
}
