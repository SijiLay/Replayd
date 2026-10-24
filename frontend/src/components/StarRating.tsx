import "./StarRating.css"
import { useState } from "react"

type StarRatingProps = {
    value: number | null
    onChange?: (rating: number | null) => void
    readOnly?: boolean
}

function StarRating({ value, onChange, readOnly = false }: StarRatingProps) {
    const stars = [1, 2, 3, 4, 5]

    const [hoverValue, setHoverValue] = useState<number | null>(null)

    const displayValue = hoverValue ?? value ?? 0

    function getRatingFromMouse(
        star: number,
        event: React.MouseEvent<HTMLButtonElement>
    ) {
        const rect = event.currentTarget.getBoundingClientRect()
        const mousePosition = event.clientX - rect.left

        return mousePosition < rect.width / 2
            ? star - 0.5
            : star
    }

    return (
        <div
            className={`star-rating ${readOnly ? "read-only" : ""}`}
            onMouseLeave={() => setHoverValue(null)}
        >
            <div className="stars">
                {stars.map((star) => {
                    const rating = displayValue

                    const isFull = rating >= star

                    const isHalf =
                        rating >= star - 0.5 &&
                        rating < star

                    return (
                        <button
                            key={star}
                            type="button"
                            className={`star-button ${
                                isFull ? "filled" : ""
                            }`}
                            onMouseMove={(event) => {
                                if (!readOnly) {
                                    setHoverValue(getRatingFromMouse(star, event))
                                }
                            }}

                            onClick={(event) => {
                                if (!readOnly && onChange) {
                                    onChange(getRatingFromMouse(star, event))
                                }
                            }}


                        >
                            <span className="star-empty">★</span>

                            {(isFull || isHalf) && (
                                <span
                                    className={
                                        isFull
                                            ? "star-fill full"
                                            : "star-fill half"
                                    }
                                >
        ★
    </span>
                            )}
                        </button>
                    )
                })}
            </div>

            {!readOnly && value !== null && onChange && (
                <button
                    type="button"
                    className="clear-rating"
                    onClick={() => onChange(null)}
                >
                    Clear
                </button>
            )}
        </div>
    )
}

export default StarRating