import React, { useContext, useEffect, useState, useCallback } from "react";
import Chart from "react-apexcharts";
import AuthContext from "../AuthContext";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ["Apple", "Knorr", "Shoop", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [0, 1, 5, 8, 9, 15],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

function Dashboard() {
  const [saleAmount, setSaleAmount] = useState("");
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [chart, setChart] = useState({
    options: {
      chart: { id: "basic-bar" },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    },
    series: [
      {
        name: "Monthly Sales Amount",
        data: [10, 20, 40, 50, 60, 20, 10, 35, 45, 70, 25, 70],
      },
    ],
  });

  const authContext = useContext(AuthContext);

  const fetchTotalSaleAmount = useCallback(async () => {
    try {
      const response = await fetch(
        `https://backend-56fq.onrender.com/api/sales/get/${authContext.user}/totalsaleamount`
      );
      const data = await response.json();
      setSaleAmount(data.totalSaleAmount);
    } catch (error) {
      console.error("Error fetching total sale amount:", error);
    }
  }, [authContext.user]);

  const fetchTotalPurchaseAmount = useCallback(async () => {
    try {
      const response = await fetch(
        `https://backend-56fq.onrender.com/api/purchase/get/${authContext.user}/totalpurchaseamount`
      );
      const data = await response.json();
      setPurchaseAmount(data.totalPurchaseAmount);
    } catch (error) {
      console.error("Error fetching total purchase amount:", error);
    }
  }, [authContext.user]);

  const fetchStoresData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://backend-56fq.onrender.com/api/store/get/${authContext.user}`
      );
      const data = await response.json();
      setStores(data);
    } catch (error) {
      console.error("Error fetching stores data:", error);
    }
  }, [authContext.user]);

  const fetchProductsData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://backend-56fq.onrender.com/api/product/get/${authContext.user}`
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products data:", error);
    }
  }, [authContext.user]);

  const fetchMonthlySalesData = useCallback(async () => {
    try {
      const response = await fetch(
        "https://backend-56fq.onrender.com/api/sales/getmonthly"
      );
      const data = await response.json();
      setChart((prevChart) => ({
        ...prevChart,
        series: [
          {
            name: "Monthly Sales Amount",
            data: data.salesAmount,
          },
        ],
      }));
    } catch (error) {
      console.error("Error fetching monthly sales data:", error);
    }
  }, []);

  useEffect(() => {
    fetchTotalSaleAmount();
    fetchTotalPurchaseAmount();
    fetchStoresData();
    fetchProductsData();
    fetchMonthlySalesData();
  }, [
    fetchTotalSaleAmount,
    fetchTotalPurchaseAmount,
    fetchStoresData,
    fetchProductsData,
    fetchMonthlySalesData,
  ]);

  return (
    <div className="grid grid-cols-1 col-span-12 lg:col-span-10 gap-6 md:grid-cols-3 lg:grid-cols-4 p-4">
      <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
        <div className="inline-flex gap-2 self-end rounded bg-green-100 p-1 text-green-600">
          <span className="text-xs font-medium"> 67.81% </span>
        </div>
        <div>
          <strong className="block text-sm font-medium text-gray-500">
            Sales
          </strong>
          <p>
            <span className="text-2xl font-medium text-gray-900">
              ${saleAmount}
            </span>
          </p>
        </div>
      </article>

      <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
        <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
          <span className="text-xs font-medium"> 67.81% </span>
        </div>
        <div>
          <strong className="block text-sm font-medium text-gray-500">
            Purchase
          </strong>
          <p>
            <span className="text-2xl font-medium text-gray-900">
              ${purchaseAmount}
            </span>
          </p>
        </div>
      </article>

      <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
        <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
          <span className="text-xs font-medium"> 67.81% </span>
        </div>
        <div>
          <strong className="block text-sm font-medium text-gray-500">
            Products
          </strong>
          <p>
            <span className="text-2xl font-medium text-gray-900">
              {" "}
              {products.length}{" "}
            </span>
          </p>
        </div>
      </article>
      <article className="flex flex-col   gap-4 rounded-lg border border-gray-100 bg-white p-6 ">
        <div className="inline-flex gap-2 self-end rounded bg-red-100 p-1 text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
            />
          </svg>

          <span className="text-xs font-medium"> 67.81% </span>
        </div>

        <div>
          <strong className="block text-sm font-medium text-gray-500">
            Total Stores
          </strong>

          <p>
            <span className="text-2xl font-medium text-gray-900">
              {" "}
              {stores.length}{" "}
            </span>

            {<span className="text-xs text-gray-500"> from 0 </span>}
          </p>
        </div>
      </article>

      <div className="flex justify-around bg-white rounded-lg py-8 col-span-full">
        <div>
          <Chart
            options={chart.options}
            series={chart.series}
            type="bar"
            width="500"
          />
        </div>
        <div>
          <Doughnut data={data} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;