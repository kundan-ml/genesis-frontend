import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    LabelList,
} from 'recharts';
import { FaMemory, FaMicrochip, FaHdd, FaVideo } from 'react-icons/fa';

const DetailPopup = ({ type, onClose, usageData }) => {
    const COLORS = ['#4CAF50', '#FFC107', '#F44336', '#2196F3'];

    const renderCPUDetails = () => (
        <div className="p-6 bg-gradient-to-br from-green-900 to-green-700 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-2 text-center flex items-center justify-center text-green-100">
                <FaMicrochip className="mr-2 text-3xl text-green-400" /> CPU Usage
            </h3>
            <p className="text-center text-lg text-green-200">Current Usage: {usageData.cpuUsage}%</p>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={[{ name: 'CPU Usage', value: usageData.cpuUsage }]}>
                    <XAxis dataKey="name" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#4CAF50"
                        strokeWidth={3}
                        dot={{ stroke: '#4CAF50', strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );

    const renderMemoryDetails = () => (
        <div className="p-6 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-2 text-center flex items-center justify-center text-blue-100">
                <FaMemory className="mr-2 text-3xl text-blue-400" /> Memory Usage
            </h3>
            <p className="text-center text-lg text-blue-200">Used Memory: {usageData.usedMemory} GB</p>
            <p className="text-center text-lg text-blue-200">Total Memory: {usageData.totalMemory} GB</p>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[{ name: 'Memory', used: usageData.usedMemory, total: usageData.totalMemory }]}>
                    <XAxis dataKey="name" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip 
                    wrapperStyle={{ backgroundColor: '#333', borderRadius: '2px', padding: '5px' }} 
                    itemStyle={{ color: '#fff' }} 
                    contentStyle={{ backgroundColor: '#333', borderRadius: '5px' }} 
                />
                    <Legend />
                    <Bar dataKey="used" fill="url(#used)">
                        <LabelList dataKey="used" position="top" fill="#fff" />
                    </Bar>
                    <Bar dataKey="total" fill="url(#total)">
                        <LabelList dataKey="total" position="top" fill="#fff" />
                    </Bar>
                    <defs>
                        <linearGradient id="used" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2196F3" stopOpacity={1} />
                            <stop offset="100%" stopColor="#4CAF50" stopOpacity={1} />
                        </linearGradient>
                        <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FFC107" stopOpacity={1} />
                            <stop offset="100%" stopColor="#F44336" stopOpacity={1} />
                        </linearGradient>
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );

    const renderDiskDetails = () => (
        <div className="p-6 bg-gradient-to-br from-red-900 to-red-700 rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-2 text-center flex items-center justify-center text-red-100">
                <FaHdd className="mr-2 text-3xl text-red-400" /> Disk Usage
            </h3>
            <p className="text-center text-lg text-red-200">Used Disk: {usageData.usedDisk} GB</p>
            <p className="text-center text-lg text-red-200">Total Disk: {usageData.totalDisk} GB</p>
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={[
                            { name: 'Used', value: usageData.usedDisk },
                            { name: 'Free', value: usageData.totalDisk - usageData.usedDisk },
                        ]}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {[...Array(2)].map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );

    const renderGPUDetails = () => {
        const index = parseInt(type.split('-')[1]);
        const gpu = usageData.gpuData[index];
        return (
            <div
                className="p-6 bg-gradient-to-br from-purple-900 to-purple-700 rounded-lg shadow-lg 
                           hover:scale-105 transform transition-transform duration-300 max-w-md mx-auto"
            >
                <h3 className="text-2xl font-bold mb-2 text-center flex items-center justify-center text-purple-100 hover:text-purple-50">
                    <FaVideo className="mr-2 text-3xl text-purple-400" /> {gpu.name} Usage
                </h3>
                <p className="text-center text-lg text-purple-200">Memory Used: {gpu.memory_used} MB</p>
                <p className="text-center text-lg text-purple-200">Memory Free: {gpu.memory_free} MB</p>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[{ name: gpu.name, used: gpu.memory_used, free: gpu.memory_free }]}>
                        <XAxis dataKey="name" stroke="#fff" />
                        <YAxis stroke="#fff" />
                        <Tooltip
                            content={({ payload }) => {
                                if (!payload || payload.length === 0) return null;
                                const data = payload[0].payload;
                                return (
                                    <div style={{ backgroundColor: '#FFBB28', padding: '5px', borderRadius: '5px' }}>
                                        <p><strong>GPU Memory Used:</strong> {data.used} MB</p>
                                        <p><strong>GPU Memory Free:</strong> {data.free} MB</p>
                                    </div>
                                );
                            }}
                        />
                        <Legend />
                        <Bar dataKey="used" fill="#FFBB28" />
                        <Bar dataKey="free" fill="#FF8042" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };
    
    
    

    let details;
    switch (type) {
        case 'cpu':
            details = renderCPUDetails();
            break;
        case 'memory':
            details = renderMemoryDetails();
            break;
        case 'disk':
            details = renderDiskDetails();
            break;
        default:
            details = renderGPUDetails();
            break;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50 p-6">
            <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-3xl border border-gray-700 relative text-white transform hover:scale-105 transition-all duration-300 ease-in-out">
                <h2 className="text-3xl font-bold text-center mb-4">System Details</h2>
                <div className="mb-6">{details}</div>
                <button
                    onClick={onClose}
                    className="mt-4 w-full py-3 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold rounded-full transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default DetailPopup;
