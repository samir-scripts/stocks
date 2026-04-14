WITH staging as (
    SELECT * FROM {{ref("stg_stocks")}}
),
calculations AS (
    SELECT
        price_date,
        ticker,
        close_price,
        -- moving average
        AVG(close_price) OVER (
            PARTITION BY ticker
            ORDER BY price_date
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) as moving_avg_7_day, 
    -- daily change
        (close_price - LAG(close_price) OVER (PARTITION BY ticker ORDER BY price_date))
        / NULLIF(LAG(close_price) OVER (PARTITION BY ticker ORDER BY price_date), 0) as daily_return_pct 
    FROM staging

)

SELECT * FROM calculations WHERE "daily_return_pct" IS NOT NULL

