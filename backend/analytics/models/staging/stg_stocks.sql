WITH source as (
    SELECT * FROM {{source('public', 'raw_stocks')}}
),
renamed AS (
    SELECT
        "price_date"::timestamp as price_date,
        "Ticker" as ticker,
        "Open"::float as open_price,
        "High"::float as high_price,
        "Low"::float as low_price,
        "Close"::float as close_price, 
        "Volume"::bigint as volume
    FROM source
    WHERE "Ticker" IS NOT NULL
        AND "Close" IS NOT NULL
),
deduplicated AS (
    SELECT 
        *,
        ROW_NUMBER() OVER(PARTITION BY ticker, price_date ORDER BY volume DESC) as rn
    FROM renamed
)

SELECT 
    price_date,
    ticker,
    open_price,
    high_price,
    low_price,
    close_price,
    volume
FROM deduplicated
WHERE rn = 1