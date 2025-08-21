// src/app/deliveries/new/page.js
import React from 'react';
import NewDeliveryForm from '@/components/delivery-form/NewDeliveryForm';

export default function NewDeliveryPage() {
    return (
        <div>
            <h1 className="text-3xl font-extrabold text-white-900 mb-6">Create a New Delivery</h1>
            <p className="mb-4 text-white-600">Fill out the form to create a delivery. The address will be geocoded in the background.</p>
            <NewDeliveryForm providerId="1" />
        </div>
    );
}