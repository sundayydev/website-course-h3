import React, { useState, useEffect } from 'react';
import { getCategories } from '@/api/categoryApi';
import { filterCourses } from '@/api/filterApi';
import { getCourses } from '@/api/courseApi';

const FilterPanel = ({ isOpen, onToggle, onFilterChange }) => {
    const [categories, setCategories] = useState([]);
    const [filterParams, setFilterParams] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        minRating: '',
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error('Lỗi khi lấy danh mục:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterParams((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const applyFilters = async () => {
        try {
            const filteredCourses = await filterCourses(filterParams);
            onFilterChange(filteredCourses);
            onToggle(); // Ẩn dropdown sau khi áp dụng
        } catch (error) {
            console.error('Lỗi khi áp dụng bộ lọc:', error);
            onFilterChange([]);
        }
    };

    const handleReset = async () => {
        setFilterParams({
            category: '',
            minPrice: '',
            maxPrice: '',
            minRating: '',
        });
        try {
            const allCourses = await getCourses();
            onFilterChange(allCourses);
            onToggle();
        } catch (error) {
            console.error('Lỗi khi reset bộ lọc:', error);
            onFilterChange([]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        applyFilters();
    };

    return (
        <div
            className={`absolute top-10 right-0 w-64 bg-gray-100 rounded-lg shadow-lg p-4 z-10 transition-all duration-300 ease-in-out ${
                isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                    <select
                        name="category"
                        value={filterParams.category}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Giá tối thiểu (VND)</label>
                    <input
                        type="number"
                        name="minPrice"
                        value={filterParams.minPrice}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="0"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Giá tối đa (VND)</label>
                    <input
                        type="number"
                        name="maxPrice"
                        value={filterParams.maxPrice}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        placeholder="10000000"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Xếp hạng tối thiểu</label>
                    <select
                        name="minRating"
                        value={filterParams.minRating}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="">Tất cả</option>
                        <option value="1">1 sao</option>
                        <option value="2">2 sao</option>
                        <option value="3">3 sao</option>
                        <option value="4">4 sao</option>
                        <option value="5">5 sao</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Áp dụng bộ lọc
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="mt-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FilterPanel;