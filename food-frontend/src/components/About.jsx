import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import Header from "./Header";
// import "../App.css";

function FoodWastagePage() {
  // Chart data
  const chartData = {
    labels: ["Fruits & Vegetables", "Cereals", "Dairy", "Meat", "Seafood"],
    datasets: [
      {
        label: "Food Wasted (in tons)",
        data: [1300, 900, 500, 700, 300],
        backgroundColor: ["#4caf50", "#ff9800", "#2196f3", "#e91e63", "#9c27b0"],
      },
    ],
  };

  return (
    <div className="food-wastage-page">
     <Header/>
     

      <main className="content">
        <section>
          <h2>Introduction</h2>
          <p>
            Each year, one-third of all food produced for human consumption is
            lost or wasted. This not only impacts global food security but also
            affects natural resources and the economy.
          </p>
          <img
            src="https://waystup.eu/wp-content/uploads/2020/09/waystup_international_day_of_food_loss_and_waste.jpg"
            alt="Food wastage concept"
            className="image"
          />
        </section>

        <section>
          <h1>Causes of Food Wastage</h1>
          <ul>
            <li>Poor storage and transportation in low-income countries</li>
            <li>Consumer behavior and misunderstanding of date labels</li>
            <li>Excessive purchasing and poor food management</li>
          </ul>
          <img
            src="https://onethird.io/hs-fs/hubfs/Food-Loss-vs-Waste.png?width=1920&height=1080&name=Food-Loss-vs-Waste.png/600x300"
            alt="Food transport issues"
            className="image"
          />
        </section>

        <section>
          <h1>Impacts of Food Wastage</h1>
          <ul>
            <li>Climate: 3.3 Gt of CO2 equivalent emissions annually</li>
            <li>Water: 250 km³ of blue water wasted</li>
            <li>Land: 1.4 billion hectares used for wasted food</li>
          </ul>
        </section>

        <section>
          <h2>Statistics on Food Wastage</h2>
          <div className="chart-container">
            <Bar data={chartData} />
          </div>
        </section>

        <section>
          <h2>Solutions to Food Wastage</h2>
          <ul>
            <li>Improve harvesting and post-harvesting techniques</li>
            <li>Develop better storage and transportation infrastructure</li>
            <li>Raise awareness and promote behavioral change</li>
            <li>Integrate food wastage solutions into policies</li>
          </ul>
        </section>
      </main>

    </div>
  );
}

export default FoodWastagePage;
