<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CategoryCollection extends ResourceCollection
{
    public $collects = CategoryResource::class;

    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
        ];
    }

    public function paginationInformation(Request $request, array $paginated, array $default): array
    {
        return [
            'meta'  => [
                'current_page' => $default['meta']['current_page'],
                'last_page'    => $default['meta']['last_page'],
                'per_page'     => $default['meta']['per_page'],
                'total'        => $default['meta']['total'],
                'from'         => $default['meta']['from'],
                'to'           => $default['meta']['to'],
            ],
            'links' => [
                'first' => $default['links']['first'],
                'last'  => $default['links']['last'],
                'prev'  => $default['links']['prev'],
                'next'  => $default['links']['next'],
            ],
        ];
    }
}
