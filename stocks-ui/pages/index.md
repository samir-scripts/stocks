---
title: Big Tech Stock Performance
---

```sql s_performance
    select
        ticker,
        price_date,
        close_price
    from stock_data
    where price_date >= current_date - interval '50 days'
    order by ticker, price_date desc

```

<LineChart 
    data={s_performance} 
    x=price_date
    y=close_price 
    series=ticker 
/>
