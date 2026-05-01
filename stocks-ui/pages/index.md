---
title: Big Tech Stock Performance
---

```sql ticker_selection
    select ticker from postgres.close_price
    group by 1
    order by 1
```

<Dropdown 
    name='selected_ticker' 
    data={ticker_selection} 
    value=ticker 
    title="Select a Ticker"
    defaultValue='MSFT' 
/>

```sql s_performance
    select
        ticker,
        price_date,
        close_price
    from postgres.close_price
    where ticker = '${inputs.selected_ticker.value}'
        and price_date >= current_date - interval '90 days'
    order by ticker, price_date asc

```

<LineChart 
    data={s_performance} 
    x=price_date
    y=close_price 
    series=ticker 
/>
