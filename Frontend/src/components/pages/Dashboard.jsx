import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useState } from "react";
import CreateProductTab from "../UI/CreateProductTab"
import ProductsListTab from "../UI/ProductsListTab"
import AnalyticsTab from "../UI/AnalyticsTab"

const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: ShoppingBasket },
  { id: "analytics", label: "Analytics", icon: BarChart },
];
const Dashboard = () => {

  const [activeTab, setActiveTab] = useState("create");

  return (
    <section className="min-h-screen ">
      <div className="container mx-auto px-4 py-6 ">

        <h2 className="text-3xl font-bold text-center">Admin Dashboard</h2>
        <div className="flex max-sm:flex-col gap-4 justify-center mt-8 mb-6">
          {tabs.map((tab) => {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex max-sm:flex-col items-center px-6 py-2 mx-2 rounded-md transition-colors duration-200 ${activeTab === tab.id
                    ? "bg-emerald-600 text-white"
                    : "bg-gradient-to-r from-[#381e38] via-[#4f1579] to-[#2e0594]"
                  }`}
              >
                <tab.icon className='mr-1 h-5 w-5' />
                {tab.label}
              </button>
            )
          })}
        </div>
    
        {activeTab === "create" && <CreateProductTab/>}
        {activeTab === "products" && <ProductsListTab/>}
        {activeTab === "analytics" && <AnalyticsTab/>}
        </div>
    </section>
  )
}

export default Dashboard
