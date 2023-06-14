// ProductCardGrid Component
// Includes the product grid and sorting + filtering

import React from "react";

import ProductCard from "./ProductCard";
import RangeSlider from "./RangeSlider";
import EmptyState from "./EmptyState";

function ProductCardGrid(props) {
    const {
        products,
        favorites,
        currency,
        productsSortBy,
        productsFilterSliderValues,
        onTogglePopup,
        onFavorite,
        onSort,
        onSliderChange,
    } = props;

    return (
        <div>
            <div className="product-card-grid__btn-container">
                <div>
                    <p className="product-card-grid__container-label text-styles text-styles--label">
                    Сортувати за:
                    </p>

                    <div className="btn btn--select product-card-grid__btn">
                        <select
                            onChange={(event) => onSort(event.target.value)}
                            name="sort"
                            id="sort-select"
                            defaultValue={productsSortBy}
                        >
                            <option key="sort-pricing-default" value="default">
                                Улюблені
                            </option>
                            <option
                                key="sort-pricing-ascending"
                                value="ascending"
                            >
                                За зростанням ціни
                            </option>
                            <option
                                key="sort-pricing-descending"
                                value="descending"
                            >
                               За спаданням ціни
                            </option>
                            ))
                        </select>
                        <img
                            src={
                                process.env.PUBLIC_URL + "/icons/down-arrow.svg"
                            }
                            alt=""
                        />
                    </div>
                </div>

                <div>
                    <p className="product-card-grid__container-label text-styles text-styles--label">
                    Фільтрувати за діапазоном цін:
                    </p>
                    <div className="btn btn--slider product-card-grid__btn">
                        <div className="slider-content">
                            <RangeSlider
                                onSliderChange={onSliderChange}
                                values={productsFilterSliderValues}
                                productsFilterSliderValues={
                                    productsFilterSliderValues
                                }
                                currency={currency}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {products.length === 0 ? (
                <EmptyState
                    heading="Товари не знайдено."
                    description="Відкоригуйте ціновий діапазон, щоб відкрити для себе нові товари."
                    buttonText={null}
                    buttonLink={null}
                />
            ) : (
                <div className="product-card-grid__product-grid">
                    {products.map((item) => {
                        return (
                            <ProductCard
                                key={item.id}
                                product={item}
                                favorites={favorites}
                                currency={currency}
                                onTogglePopup={onTogglePopup}
                                onFavorite={onFavorite}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ProductCardGrid;
