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
)

SELECT * FROM renamed