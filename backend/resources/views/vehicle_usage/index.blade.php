<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vehicle Usage for {{ $logisticProvider->company_name }}</title>
    <style>
        body { font-family: sans-serif; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>Daily Vehicle Usage for: {{ $logisticProvider->company_name }}</h1>

    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Total Distance (km)</th>
                <th>Total Hours in Use</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($dailyUsage as $usage)
                <tr>
                    <td>{{ $usage->usage_date }}</td>
                    <td>{{ $usage->total_distance }}</td>
                    <td>{{ $usage->total_hours }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="3">No usage data available.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>