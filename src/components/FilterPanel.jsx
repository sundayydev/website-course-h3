import React, { useState, useEffect } from 'react';
import { getCategories } from '@/api/categoryApi';
import { filterCourses } from '@/api/filterApi';
import { getActiveCourses } from '@/api/courseApi';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const FilterPanel = ({ isOpen, onToggle, onFilterChange }) => {
    const [categories, setCategories] = useState([]);
    const [filterParams, setFilterParams] = useState({
        category: 'all',
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

    const handleFilterChange = (name, value) => {
        setFilterParams((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const applyFilters = async () => {
        try {
            const params = { ...filterParams };
            if (params.category === 'all') {
                params.category = '';
            }
            const filteredCourses = await filterCourses(params);
            onFilterChange(filteredCourses);
            onToggle();
        } catch (error) {
            console.error('Lỗi khi áp dụng bộ lọc:', error);
            onFilterChange([]);
        }
    };

    const handleReset = async () => {
        setFilterParams({
            category: 'all',
            minPrice: '',
            maxPrice: '',
            minRating: '',
        });
        try {
            const allCourses = await getActiveCourses();
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
            className={`absolute top-10 right-0 w-64 bg-white rounded-lg shadow-lg p-4 z-10 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category">Danh mục</Label>
                    <Select
                        name="category"
                        value={filterParams.category}
                        onValueChange={(value) => handleFilterChange('category', value)}
                    >
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Tất cả danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả danh mục</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="minPrice">Giá tối thiểu (VND)</Label>
                    <Input
                        id="minPrice"
                        type="number"
                        name="minPrice"
                        value={filterParams.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        placeholder="0"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="maxPrice">Giá tối đa (VND)</Label>
                    <Input
                        id="maxPrice"
                        type="number"
                        name="maxPrice"
                        value={filterParams.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        placeholder="10000000"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="minRating">Xếp hạng tối thiểu</Label>
                    <Select
                        name="minRating"
                        value={filterParams.minRating}
                        onValueChange={(value) => handleFilterChange('minRating', value)}
                    >
                        <SelectTrigger id="minRating">
                            <SelectValue placeholder="Tất cả" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="1">1 sao</SelectItem>
                            <SelectItem value="2">2 sao</SelectItem>
                            <SelectItem value="3">3 sao</SelectItem>
                            <SelectItem value="4">4 sao</SelectItem>
                            <SelectItem value="5">5 sao</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2">
                    <Button type="submit" className="w-full">
                        Áp dụng bộ lọc
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleReset} className="w-full">
                        Reset
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default FilterPanel;